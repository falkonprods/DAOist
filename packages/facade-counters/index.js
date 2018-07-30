const production = process.env.NODE_ENV === 'production'
if (!production) {
  require('dotenv').config()
}

const mongo = require('mongo')
const DB_COLLECTION_USERS = 'users'
const fetch = require('node-fetch')
const OstClient = require('ost-client')

let ostClient = new OstClient(fetch)

function FacadeCounters(ost, mongo) {
  this.ost = ost
  this.mongo = mongo
}

FacadeCounters.prototype.getWineries = async function() {
  try {
    let connection = await this.mongo()
    let db = await connection.db()
    let collection = db.collection(DB_COLLECTION_USERS)
    let user = await collection.find({}).toArray()
    return user.length
  } catch (error) {
    throw error
  }
}

FacadeCounters.prototype.getVincoins = async function() {
  try {
    let ostTokenResponse = await this.ost.token()
    let ostToken = await ostTokenResponse.json()

    if (ostToken.success === false) {
      throw new Error(ostToken.err.msg)
    }

    return ostToken.data.token.total_supply
  } catch (error) {
    throw new Error(error.message)
  }
}

let facadeCounters = new FacadeCounters(ostClient, mongo)

module.exports.facadeCounters = async () => {
  let response = {
    statusCode: 400,
    headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: null,
    isBase64Encoded: false,
  }

  try {
    const [wineries, vincoins] = await Promise.all([
      facadeCounters.getWineries(),
      facadeCounters.getVincoins(),
    ])
    response.statusCode = 200
    response.body = JSON.stringify({
      wineries: wineries,
      vincoins: vincoins,
      ideas: 0,
    })
  } catch (error) {
    response.body = JSON.stringify({ error: error.message })
  }

  return response
}
