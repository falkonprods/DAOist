const production = process.env.NODE_ENV === 'production'
if (!production) {
  require('dotenv').config('../../.env.production')
}

const OSTSDK = require('@ostdotcom/ost-sdk-js')
const ost = new OSTSDK({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  apiEndpoint: process.env.API_BASE_URL_LATEST,
})

const mongo = require('mongo')
const membersService = require('members-service')(mongo)
const transactionsService = require('transactions-service')(ost)
const likeService = require('./like-service')(membersService, transactionsService, mongo)

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

module.exports.like = async event => {
  try {
    let parameters = { fromUser: null, toUser: null }

    if (event.queryStringParameters) {
      parameters.next = event.queryStringParameters.fromUser
        ? event.queryStringParameters.fromUser
        : null
      parameters.next = event.queryStringParameters.toUser
        ? event.queryStringParameters.toUser
        : null
    }

    let result = await likeService.like(parameters)
    apiGatewayResponse.statusCode = 200
    apiGatewayResponse.body = JSON.stringify(result)
  } catch (error) {
    console.log(error)
    apiGatewayResponse.body = JSON.stringify({ message: error.message })
  }

  return apiGatewayResponse
}
