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

const filterKeys = [
  'result_type',
  'company_uuid',
  'token_erc20_address',
  'airdrop_contract_address',
  'simple_stake_contract_address',
]

module.exports.token = async () => {
  try {
    const res = await ost.services.token.get({})

    if (res.success) {
      apiGatewayResponse.statusCode = 200

      for (const key of filterKeys) {
        delete res.data.token[key]
      }

      apiGatewayResponse.body = JSON.stringify(res.data)
    }

    apiGatewayResponse.body = JSON.stringify(res.err)
  } catch (err) {
    console.log(err)
    apiGatewayResponse.body = JSON.stringify({ message: err.message })
  }

  return apiGatewayResponse
}
