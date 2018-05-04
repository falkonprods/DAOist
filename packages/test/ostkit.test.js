
const production = process.env.NODE_ENV === 'production'
if (!production) {
  require('dotenv').config()
}

const baseUri = process.env['API_BASE_URL']
const fetchMock = (t, expected) => (uri, data = {}) => {
  t.equal(expected.uri, uri, `Assert expected: ${expected.uri} matches actual: ${uri}`)
  t.equal(expected.data.method, data.method, `Assert expected: ${expected.data.method} matches actual: ${data.method}`)
}
const OstClient = require('ost-client')
const tape = require('tape')

tape('createUser', (t) => {
  const ost = new OstClient(fetchMock(t, {
    uri: baseUri + '/users/create',
    data: {method: 'POST'}
  }))

  ost.usersCreate('Boris')
  t.end()
})
