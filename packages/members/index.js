const production = process.env.NODE_ENV === 'production'
if (!production) {
  require('dotenv').config('../../.env.production')
}
const mongo = require('mongo')
const membersService = require('./members-service.js')(mongo)
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

module.exports.members = async event => {
  try {
    let parameters = { limit: 10, next: null }

    if (event.queryStringParameters) {
      parameters.limit = event.queryStringParameters.limit
        ? parseInt(event.queryStringParameters.limit)
        : 10
      parameters.next = event.queryStringParameters.next ? event.queryStringParameters.next : null
    }

    let result = await membersService.fetchAll(parameters)
    apiGatewayResponse.statusCode = 200
    apiGatewayResponse.body = JSON.stringify(result)
  } catch (error) {
    console.log(error)
    apiGatewayResponse.body = JSON.stringify({ message: error.message })
  }

  return apiGatewayResponse
}
