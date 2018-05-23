const production = process.env.NODE_ENV === 'production'
if (!production) {
  require('dotenv').config('../../.env')
}

const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const OstClient = require('ost-client')

let ostClient = new OstClient(fetch)

function FacadeProfile(ost, jwt) {
  this.ost = ost
  this.jwt = jwt
}

FacadeProfile.prototype.getUserIdFromToken = async function (token) {
  return this.jwt.verify(token, process.env.JWT_SECRET).user.ost.id
}

FacadeProfile.prototype.getTokenBalanceByJwtToken = async function (jwtToken) {
  const response = await ostClient.usersRetrieve(await this.getUserIdFromToken(jwtToken))
  const result = await response.json()

  if (result.success === false) {
    throw new Error(result.err.msg)
  }

  return result.data.user.token_balance
}

const facadeProfileService = new FacadeProfile(ostClient, jwt)

module.exports.facadeProfile = async (event) => {
  const token = event.queryStringParameters.token

  let response = {
    statusCode: 400,
    headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: null,
    isBase64Encoded: false
  }

  try {
    response.statusCode = 200
    response.body = JSON.stringify({tokenBalance: await facadeProfileService.getTokenBalanceByJwtToken(token)})
  } catch (error) {
    response.body = JSON.stringify({error: error.message})
  }

  return response
}
