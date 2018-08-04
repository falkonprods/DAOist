const DB_COLLECTION_USERS = 'users'
const ObjectID = require('mongodb').ObjectID

class MembersService {
  constructor(mongo) {
    this.mongo = mongo
  }
}

async function fetchAll(limit = 10, next = null, prev = null) {
  let connection = await this.mongo()
  let db = await connection.db()
  let collection = db.collection(DB_COLLECTION_USERS)

  let filter = {}
  let sort = {
    _id: -1,
  }

  if (next) {
    filter = {
      _id: { $lt: ObjectID(next) },
    }
  }

  if (prev) {
    filter = {
      _id: { $gt: ObjectID(prev) },
    }

    sort._id = 1
  }

  const items = await collection
    .find(filter, { fields: { ost: 0, hash: 0 } })
    .limit(limit)
    .sort(sort)
    .toArray()

  next = items[items.length - 1]._id

  return {
    members: items,
    next: next,
  }
}

MembersService.prototype.fetchAll = async function({ limit, next }) {
  return await fetchAll.call(this, limit, next)
}

/**
 * @param {*} mongo
 */
module.exports = mongo => {
  return new MembersService(mongo)
}
