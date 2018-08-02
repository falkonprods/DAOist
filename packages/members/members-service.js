const DB_COLLECTION_USERS = 'users'
const ObjectID = require('mongodb').ObjectID

class MembersService {
  constructor(mongo) {
    this.mongo = mongo
  }
}

async function fetchAll(limit = 10, next = null) {
  let connection = await this.mongo()
  let db = await connection.db()
  let collection = db.collection(DB_COLLECTION_USERS)

  let filter = {}

  if (next) {
    filter = {
      _id: { $lt: ObjectID(next) },
    }
  }

  const items = await collection
    .find(filter, { fields: { ost: 0, hash: 0 } })
    .limit(limit)
    .sort({
      _id: -1,
    })
    .toArray()

  next = items[items.length - 1]._id

  return {
    members: items,
    next: next,
  }
}

MembersService.prototype.fetchAll = async function ({ limit, next }) {
  return await fetchAll.call(this, limit, next)
}

/**
 *
 * @param {*} mongo
 * @param {*} fetch
 */
module.exports = mongo => {
  return new MembersService(mongo)
}
