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
const balancesService = require('balances-service')(ost)
const transactionsService = require('transactions-service')(ost)

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

function getUserIdFromToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET).user.ost.id
}

async function getUserBalance(userID) {
  return await balancesService.fetch(userID)
}

async function getUserTransactions(userID) {
  return await transactionsService.list(userID)
}

async function getTokenDetails() {
  return await tokenService.fetch()
}

module.exports.profile = async event => {
  const token = event.queryStringParameters.token
  const userID = getUserIdFromToken(token)

  try {
    const balance = (await getUserBalance(userID)).data.balance
    const transactions = (await getUserTransactions(userID)).data.transactions
    const token = await getTokenDetails()

    apiGatewayResponse.statusCode = 200
    apiGatewayResponse.body = JSON.stringify({
      balance,
      transactions,
      token: token.data.token,
      price_points: token.data.price_points,
    })
  } catch (err) {
    apiGatewayResponse.body = JSON.stringify(err.message)
  }

  return apiGatewayResponse
}
