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

// Get OST user ID from token
function getUserIdFromToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET).user.ost.id
}

// Get Vinzy user ID from token
function getVinzyUserIdFromToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET).user._id
}

// Get user token balance
async function getUserBalance(userID) {
  return await balancesService.fetch(userID)
}

// Get user transactions
async function getUserTransactions(userID) {
  return await transactionsService.list(userID)
}

// Get Branded Token details and conversion rates
async function getTokenDetails() {
  return await tokenService.fetchFiltered()
}

module.exports.profile = async event => {
  const token = event.queryStringParameters.token
  const userID = getUserIdFromToken(token)
  const vinzyUserID = getVinzyUserIdFromToken(token)

  try {
    const balance = (await getUserBalance(userID)).data.balance
    const transactions = (await getUserTransactions(userID)).data.transactions
    const token = await getTokenDetails()

    apiGatewayResponse.statusCode = 200
    apiGatewayResponse.body = JSON.stringify({
      vinzyUserID: vinzyUserID,
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
