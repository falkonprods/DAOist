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
    new FilterRegister(wineryName, contactName, email, password).validate()

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
    console.log(result.insertedId)
    if (result.insertedId) {
      connection.close()
      return `successfully inserted winery`
    }
  } catch (error) {
    return error
  }
}

let registerService = new Register(ostClient, mongo)

module.exports.register = async (event) => {
  let data = null
  try {
    if (event.body) {
      data = await registerService.saveWinery(event.body)
    }
  } catch (error) {
    return error
  }
  return data
}
