const production = process.env.NODE_ENV === 'production'
if (!production) {
  require('dotenv').config('../../.env')
}

const jwt = require('jsonwebtoken')
const OSTSDK = require('@ostdotcom/ost-sdk-js')

const ost = new OSTSDK({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  apiEndpoint: process.env.API_BASE_URL_LATEST,
})

const tokenService = require('token-service')(ost)
const usersService = require('users-service')(ost)
const ledgerService = require('ledger-service')(ost)
const balancesService = require('balances-service')(ost)
const actionsService = require('actions-service')(ost)

const CacheControlExpirationTime = 86400

const apiGatewayResponse = {
  statusCode: 400,
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': `public, max-age=${CacheControlExpirationTime}`,
    Expires: new Date(Date.now() + CacheControlExpirationTime).toUTCString(),
  },
  body: null,
  isBase64Encoded: false,
}

// Get OST user ID from token
function getUserIdFromToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET).user.ost.id
}

// Get Vinzy user ID from token
function getVinzyUserIdFromToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET).user._id
}

// Get user token balance
async function getUserBalance(ostUserID) {
  return await balancesService.fetch(ostUserID)
}

// Get user transactions
async function getUserTransactions(ostUserID, page_no = 1, limit = 10) {
  return await ledgerService.fetch(ostUserID, { page_no, limit })
}

// Get Branded Token details and conversion rates
async function getTokenDetails() {
  return await tokenService.fetchFiltered()
}

// Fetch the action details of transactions
async function mapActionsDetailsToTransactions(transactions) {
  const actionIDs = transactions.map(t => t.action_id)
  const actions =
    actionIDs.length > 1
      ? (await actionsService.list({ id: actionIDs.join(','), limit: 100 })).data.actions
      : [(await actionsService.get(actionIDs[0])).data.action]

  for (const t of transactions) {
    for (const a of actions) {
      if (t.action_id === Number(a.id)) {
        t.action = a
      }
    }
  }

  return transactions
}

// Fetch names of users involved in transactions
async function mapUserNamesToTransactions(transactions, excludeIDs = []) {
  // Grab an array of both recepients and senders
  const fromUserIDs = transactions.map(t => t.from_user_id)
  const toUserIDs = transactions.map(t => t.to_user_id)

  // Exclude unwanted IDs
  const userIDs = [...fromUserIDs, ...toUserIDs].filter(id => !excludeIDs.includes(id))

  // Setting the limit to the max possible value as transaction are already paginated
  const users = (await usersService.fetch({ id: userIDs.join(','), limit: 100 })).data.users

  // Assign user name to related transaction
  for (const t of transactions) {
    for (const u of users) {
      if (t.from_user_id === u.id || t.to_user_id === u.id) {
        t.involved_user_name = u.name
      }
    }
  }

  return transactions
}

module.exports.profile = async event => {
  const token = event.queryStringParameters.token
  const transactionsPage = event.queryStringParameters.transactionsPage
  const transactionsPerPage = event.queryStringParameters.transactionsPerPage
  const ostUserID = getUserIdFromToken(token)
  const vinzyUserID = getVinzyUserIdFromToken(token)
  const select = (event.queryStringParameters.select || 'balance,transactions,token,actions').split(
    ','
  )

  const responseBody = { profile: { ostUserID, vinzyUserID } }

  try {
    if (select.includes('balance')) {
      responseBody.balance = (await getUserBalance(ostUserID)).data.balance
    }

    if (select.includes('transactions')) {
      const transactions = (await getUserTransactions(
        ostUserID,
        transactionsPage,
        transactionsPerPage
      )).data.transactions

      responseBody.transactions = await mapUserNamesToTransactions(transactions, [ostUserID])

      if (select.includes('actions')) {
        responseBody.transactions = await mapActionsDetailsToTransactions(responseBody.transactions)
      }
    }

    if (select.includes('token')) {
      const token = await getTokenDetails()
      responseBody.token = token.data.token
      responseBody.price_points = token.data.price_points
    }

    apiGatewayResponse.statusCode = 200
    apiGatewayResponse.body = JSON.stringify(responseBody)
  } catch (err) {
    apiGatewayResponse.body = JSON.stringify(err.message)
  }

  return apiGatewayResponse
}
