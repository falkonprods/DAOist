const DB_COLLECTION_USERS = 'users'
const ObjectID = require('mongodb').ObjectID

class LikeService {
  constructor(members, transactions, mongo) {
    this.members = members
    this.transactions = transactions
    this.mongo = mongo
  }

  async like({ fromUser, toUser }) {
    const users = await this.members.fetchBy({
      params: [{ _id: fromUser }, { _id: toUser }],
      fields: { ost: 1 },
    })

    await this.transactions.execute(fromUser, toUser, users)
    await updateLikeMember.call(this, fromUser, toUser)
  }

  async unlike({ fromUser, toUser }) {
    const users = await this.members.fetchBy({
      params: [{ _id: fromUser }, { _id: toUser }],
      fields: { ost: 1 },
    })

    await this.transactions.execute(toUser, fromUser, users)
    await removeLikeMember.call(this, fromUser, toUser)
  }
}

async function updateLikeMember(fromUser, toUser) {
  let connection = await this.mongo()
  let db = await connection.db()
  let collection = db.collection(DB_COLLECTION_USERS)

  await collection.update(
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
  await collection.update(
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
