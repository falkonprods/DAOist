const production = process.env.NODE_ENV === 'production'
if (!production) {
  require('dotenv').config()
}

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongo = require('mongo')
const DB_COLLECTION_USERS = 'users'

const JWT_EXPIRATION_TIME = '5m'

function Login(email, password) {
  this.email = email
  this.password = password
  this.mongo = mongo
}

Login.prototype.authenticate = async function () {
  let user = null
  try {
    user = await this.getUserByEmail()
    if (user && bcrypt.compareSync(this.password, user.hash)) {
      return user
    } else {
      throw new Error('Authentication failed')
    }
  } catch (error) {
    throw error
  }
}

Login.prototype.getUserByEmail = async function () {
  try {
    let connection = await this.mongo()
    let db = await connection.db()
    let collection = db.collection(DB_COLLECTION_USERS)
    let user = await collection.find({ email: this.email }).toArray()
    return user[0]
  } catch (error) {
    throw error
  }
}

module.exports.login = async (event) => {
  if (event.isBase64Encoded === true) {
    event.body = Buffer.from(event.body, 'base64').toString('utf-8')
  }
  const { email, password } = JSON.parse(event.body)
  let user = null
  let token = null
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
    if (event.body) {
      let login = new Login(email, password)
      user = await login.authenticate()
      token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME })
      response.statusCode = 200
      response.body = JSON.stringify({token: token})
    }
  } catch (error) {
    response.body = JSON.stringify({error: error.message})
  }

  return response
}
