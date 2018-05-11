const production = process.env.NODE_ENV === 'production'
if (!production) {
  require('dotenv').config()
}

const bcrypt = require('bcrypt')
const mongo = require('mongo')
const fetch = require('node-fetch')
const OstClient = require('ost-client')

const DB_COLLECTION_USERS = 'users'

let ostClient = new OstClient(fetch)

function FilterRegister(wineryName, contactName, email, password) {
  this.wineryName = wineryName
  this.contactName = contactName
  this.email = email
  this.password = password
  this.errors = []
  this.mongo = mongo
}

FilterRegister.prototype.isValidEmail = function (email) {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (re.test(email) === false) {
    this.errors.push(`${email} is invalid`)
  }
  return this
}

FilterRegister.prototype.isEmpty = function (entity) {
  if (!entity || entity.length === 0) {
    this.errors.push(`${entity} is empty`)
  }
  return this
}

FilterRegister.prototype.hasPasswordLength = function (password) {
  if (!password || password.length < 8) {
    this.errors.push(`password is to short`)
  }
  return this
}

FilterRegister.prototype.uniqueWineryName = async function (wineryName) {
  let connection = await this.mongo()
  let db = await connection.db()
  let collection = db.collection(DB_COLLECTION_USERS)
  let users = await collection.find({ wineryName: wineryName }).toArray()
  if (users.length > 0) {
    this.errors.push(`${wineryName} is already used`)
    connection.close()
    throw new Error(JSON.stringify(this.errors))
  }
  return this
}

FilterRegister.prototype.validate = function () {
  this
    .isEmpty(this.wineryName)
    .isEmpty(this.contactName)
    .isEmpty(this.email)
    .isValidEmail(this.email)
    .hasPasswordLength(this.password)

  if (this.errors.length > 0) {
    throw new Error(JSON.stringify(this.errors))
  }
}

function Register(ost, mongo) {
  this.ost = ost
  this.mongo = mongo
}

Register.prototype.saveWinery = async function ({wineryName, contactName, email, password}) {
  try {
    let filter = new FilterRegister(wineryName, contactName, email, password)
    filter.validate()
    await filter.uniqueWineryName(wineryName)

    let hash = bcrypt.hashSync(password, 10)
    let ostCreatedResponse = await this.ost.usersCreate(wineryName)
    let ostCreated = await ostCreatedResponse.json()

    if (ostCreated.success === false) {
      throw new Error(ostCreated.err.msg)
    }
    const wineryData = { wineryName, contactName, email, hash, ost: ostCreated.data.economy_users[0] }
    let connection = await this.mongo()
    let db = await connection.db()
    let collection = db.collection(DB_COLLECTION_USERS)
    let result = await collection.insertOne(wineryData)
    if (result.insertedId) {
      connection.close()
      return `successfully inserted winery: ${wineryName}`
    }
  } catch (error) {
    throw error
  }
}

let registerService = new Register(ostClient, mongo)

module.exports.register = async (event) => {
  if (event.isBase64Encoded === true) {
    event.body = Buffer.from(event.body, 'base64').toString('utf-8')
  }

  let response = {
    statusCode: 400,
    headers: {
      'Content-type': 'application/json'
    },
    body: null,
    isBase64Encoded: false
  }

  try {
    if (event.body) {
      response.statusCode = 200
      response.body = JSON.stringify(await registerService.saveWinery(JSON.parse(event.body)))
    }
  } catch (error) {
    response.body = error.message
  }

  return response
}
