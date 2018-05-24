const production = process.env.NODE_ENV === 'production'
if (!production) {
  require('dotenv').config()
}
const OstClient = require('../ost-client')
const tape = require('tape')
const baseUri = process.env['API_BASE_URL']
const createUserSuccessResponse = `
{
  "success": true,
  "data": {
    "result_type": "economy_users",
    "economy_users": [
      {
        "id": "574b456d-5da6-4353-ad7c-9b70893e757b",
        "uuid": "574b456d-5da6-4353-ad7c-9b70893e757b",
        "name": "Boris",
        "total_airdropped_tokens": 0,
        "token_balance": 0
      }
    ],
    "meta": {
      "next_page_payload": {}
    }
  }
}`

// const fetchMockSuccess = (t, expected) => (uri, data = {}) => {
//   t.equal(uri, expected.uri, `Assert actual: ${uri} matches expected: ${expected.uri}`)
//   t.equal(data.method, expected.data.method,
//     `Assert actual HTTP Method: ${data.method} matches expected: ${expected.data.method}}`)

//   return new Promise(function (resolve, reject) {
//     resolve(Promise.resolve({
//       json: () => {
//         return JSON.parse(createUserSuccessResponse)
//       }
//     }))
//   })
// }
// tape('OstClient.createUser successfully', (t) => {
//   const ost = new OstClient(fetchMockSuccess(t, {
//     uri: baseUri + '/users/create',
//     data: {method: 'POST'}
//   }))

//   let response = ost.usersCreate('Boris')

//   response
//     .then(res => res.json())
//     .then(json => {
//       t.deepEqual(json, JSON.parse(createUserSuccessResponse), `Assert actual response matches expected response`)
//     })
//   t.end()
// })

// const fetchMockFailsAuthentication = (t, expected) => (uri, data = {}) => {
//   t.equal(uri, expected.uri, `Assert actual: ${uri} matches expected: ${expected.uri}`)
//   t.equal(data.method, expected.data.method,
//     `Assert actual HTTP Method: ${data.method} matches expected: ${expected.data.method}}`)

//   return new Promise(function (resolve, reject) {
//     reject(createUserFailedAuthenticationResponse)
//   })
// }

// const createUserFailedAuthenticationResponse = `{
//   "success": false,
//   "err": {
//     "code": "companyRestFulApi(401:HJg2HK0A_f)",
//     "msg": "Unauthorized",
//     "error_data": {}
//   }
// }`

// tape('OstClient.createUser failed authentication', (t) => {
//   const ost = new OstClient(fetchMockFailsAuthentication(t, {
//     uri: baseUri + '/users/create',
//     data: {method: 'POST'}
//   }))

//   let response = ost.usersCreate('Boris')

//   response
//     .catch(error => {
//       t.deepEqual(error, createUserFailedAuthenticationResponse, `Assert actual response matches expected response`)
//     })
//   t.end()
// })

// tape('test', (t) => {
//   const fetch = require('node-fetch')
//   const ost = new OstClient(fetch)
//   ost.token()
//     .then(resp => resp.json())
//     .then(x => console.log(x))
//     .catch(error => console.log(error))

//   t.end()
// })

tape('test', (t) => {
  const fetch = require('node-fetch')
  const ost = new OstClient(fetch)
  ost.usersRetrieve('aef6b267-c06f-4260-b2b7-9d6255f6504d')
    .then(resp => resp.json())
    .then(x => console.log(x))
    .catch(error => console.log(error))

  t.end()
})
