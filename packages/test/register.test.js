const production = process.env.NODE_ENV === 'production'
if (!production) {
  require('dotenv').config()
}

const register = require('register')
const event = {
  body: {
    wineryName: 'Mosel winery',
    contactName: 'Boris',
    email: 'boris@websoftwar.es',
    password: 'password1234'
  }
}

let result = register.register(event)
result.then(data => console.log(data)).catch(error => console.log(error))
