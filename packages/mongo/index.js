const MongoClient = require('mongodb').MongoClient
const connectionUri = process.env['MONGO_CONNECT_URI']

function connection () {
  let myDb
  return new Promise((resolve, reject) => {
    if (myDb === undefined) {
      MongoClient.connect(connectionUri, function (err, db) {
        if (err) { return reject(err) }
        myDb = db
        resolve(db)
      })
    } else {
      reject(myDb)
    }
  })
}

module.exports = connection
