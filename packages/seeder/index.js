const faker = require('faker')
const register = require('../register').register
let i = 0

faker.locale = "en";

const production = process.env.NODE_ENV === 'production'
if (!production) {
  require('dotenv').config('../../.env')
}

function f1 () {
  let event = {
    body: JSON.stringify({
      wineryName: faker.company.companyName(0),
      contactName: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    })
  }

  register(event)
    .then(response => console.log(JSON.parse(response.body).data.ost.id))
    .catch(error => console.error(error))
}
function f () {
  f1()
  i += 1
  setTimeout(function () {
    if (i < 100) {
      f()
    } else {
      process.exit()
    }
  }, 1000)
}
f()
