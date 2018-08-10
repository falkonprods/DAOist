const production = process.env.NODE_ENV === 'production'
if (!production) {
  require('dotenv').config('../../.env.production')
}
const fetch = require('node-fetch')

const faker = require('faker')
let i = 0

faker.locale = 'en'

function f1() {
  let event = JSON.stringify({
    wineryName: faker.company.companyName(0),
    contactName: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  })

  fetch(`${process.env.VINZY_API_BASE_URL}/register`, {
    method: 'POST',
    body: event,
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.log(err))
}

function f() {
  f1()
  i += 1
  setTimeout(function() {
    if (i < 100) {
      f()
    } else {
      process.exit()
    }
  }, 1000)
}
f()
