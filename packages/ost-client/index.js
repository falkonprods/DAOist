const URL = require('url')
const crypto = require('crypto')
const queryString = require('query-string')

const apiKey = process.env['API_KEY']
const apiSecret = process.env['API_SECRET']
const baseUri = process.env['API_BASE_URL']

function generateQueryString(endpoint, inputParams) {
  const queryParamsString = queryString.stringify(inputParams, { arrayFormat: 'bracket' }).replace(/%20/g, '+')
  return endpoint + '?' + queryParamsString
}

function createTimeString() {
  let d = new Date()
  let t = d.getTime()
  let o = t + ''
  return o.substring(0, 10)
}

function generateApiSignature(stringToSign, apiSecret) {
  let buff = new Buffer.from(apiSecret, 'utf8')
  let hmac = crypto.createHmac('sha256', buff)
  hmac.update(stringToSign)
  return hmac.digest('hex')
}

function OstClient(fetch) {
  this.client = fetch
}

/**
 * @see https://dev.ost.com/docs/api_users_create.html
 * @param name
 * @returns {Promise<*>}
 */
OstClient.prototype.usersCreate = function (name) {
  const endpoint = '/users/create'
  let stringToSign = generateQueryString(endpoint, { api_key: apiKey, request_timestamp: createTimeString(), name: name })
  let uri = stringToSign + '&signature=' + generateApiSignature(stringToSign, apiSecret)
  let params = URL.parse(uri).query
  return this.client(baseUri + endpoint, { method: 'POST', body: new URL.URLSearchParams(params) })
}

/**
* @see https://dev.ost.com/docs/api_users_retrieve.html
* @param id
* @returns {Promise<*>}
*/
OstClient.prototype.usersRetrieve = function (id) {
  const endpoint = `/users/${id}`
  let stringToSign = generateQueryString(endpoint, { api_key: apiKey, request_timestamp: createTimeString() })
  let uri = stringToSign + '&signature=' + generateApiSignature(stringToSign, apiSecret)
  return this.client(baseUri + uri, { method: 'GET' })
}

/**
 * @see https://dev.ost.com/docs/create_token.html
 * @returns {Promise<*>}
 */
OstClient.prototype.token = function () {
  const endpoint = '/token'
  let stringToSign = generateQueryString(endpoint, { api_key: apiKey, request_timestamp: createTimeString() })
  let uri = stringToSign + '&signature=' + generateApiSignature(stringToSign, apiSecret)
  return this.client(baseUri + uri, { method: 'GET' })
}

module.exports = OstClient
