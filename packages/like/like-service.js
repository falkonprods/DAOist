const DB_COLLECTION_USERS = 'users'
const ObjectID = require('mongodb').ObjectID

class LikeService {
  constructor(members, transactions, mongo) {
    this.members = members
    this.transactions = transactions
    this.mongo = mongo
    this.actionID = process.env.LIKE_ACTION_ID
  }

  // Execute a transaction
  async like({ fromUser, toUser }) {
    const users = await this.members.fetchBy({
      params: [{ _id: fromUser }, { _id: toUser }],
      fields: { ost: 1 },
    })
    let updated = await updateLikeMember.call(this, fromUser, toUser)
    if (updated.result.ok === 1 && updated.result.nModified === 1) {
      return await this.transactions.execute(this.actionID, fromUser, toUser, users)
    } else {
      throw new Error('Like already performed')
    }
  }

  // Reverse previously executed transaction
  async unlike({ fromUser, toUser }) {
    const users = await this.members.fetchBy({
      params: [{ _id: fromUser }, { _id: toUser }],
      fields: { ost: 1 },
    })

    let updated = await removeLikeMember.call(this, fromUser, toUser)
    if (updated.result.ok === 1 && updated.result.nModified === 1) {
      return await this.transactions.execute(this.actionID, toUser, fromUser, users)
    } else {
      throw new Error('Like already performed')
    }
  }
}

async function updateLikeMember(fromUser, toUser) {
  let connection = await this.mongo()
  let db = await connection.db()
  let collection = db.collection(DB_COLLECTION_USERS)

  return await collection.update(
    {
      _id: ObjectID(toUser),
      likes: { $ne: ObjectID(fromUser) },
    },
    {
      $inc: { likeCount: 1 },
      $push: { likes: ObjectID(fromUser) },
    }
  )
}

async function removeLikeMember(fromUser, toUser) {
  let connection = await this.mongo()
  let db = await connection.db()
  let collection = db.collection(DB_COLLECTION_USERS)

  return await collection.update(
    {
      _id: ObjectID(toUser),
      likes: { $ne: ObjectID(fromUser) },
    },
    {
      $inc: { likeCount: -1 },
      $pull: { likes: ObjectID(fromUser) },
    }
  )
}

module.exports = (membersService, transactionsService, mongo) => {
  return new LikeService(membersService, transactionsService, mongo)
}
