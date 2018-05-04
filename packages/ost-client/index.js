
const production = process.env.NODE_ENV === 'production'
if (!production) {
  require('dotenv').config()
}

const url = require('url')
const crypto = require('crypto')
const queryString = require('query-string')

const apiKey = process.env['API_KEY']
const apiSecret = process.env['API_SECRET']
const baseUri = process.env['API_BASE_URL']

function generateQueryString (endpoint, inputParams) {
  const queryParamsString = queryString.stringify(inputParams, {arrayFormat: 'bracket'}).replace(/%20/g, '+')
  const stringToSign = endpoint + '?' + queryParamsString
  return stringToSign
}

function createTimeString () {
  let d = new Date()
  let t = d.getTime()
  let o = t + ''
  return o.substring(0, 10)
}

function generateApiSignature (stringToSign, apiSecret) {
  var buff = new Buffer.from(apiSecret, 'utf8')
  var hmac = crypto.createHmac('sha256', buff)
  hmac.update(stringToSign)
  return hmac.digest('hex')
}

function OstClient (fetch) {
  this.client = fetch
}

OstClient.prototype.usersCreate = function (name) {
  const endpoint = '/users/create'
  let stringToSign = generateQueryString(endpoint, { api_key: apiKey, request_timestamp: createTimeString(), name: name })
  let uri = stringToSign + '&signature=' + generateApiSignature(stringToSign, apiSecret)
  let params = url.parse(uri).query
  return this.client(baseUri + endpoint, { method: 'POST', body: new url.URLSearchParams(params) })
}

module.exports = OstClient
