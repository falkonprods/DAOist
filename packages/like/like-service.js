const DB_COLLECTION_USERS = 'users'
const ObjectID = require('mongodb').ObjectID

class LikeService {
  constructor(members, ost, actionId, mongo) {
    this.members = members
    this.ost = ost
    this.actionId = actionId
    this.mongo = mongo
  }
}

async function likeOstTransaction(fromUser, toUser, users) {
  const transactionService = this.ost.services.transactions
  let ostTransactionModel = { from_user_id: null, to_user_id: null, action_id: this.actionId }

  for (let i = 0; i < users.length; i++) {
    if (users[i]._id == fromUser) {
      ostTransactionModel.from_user_id = users[i].ost.id
    }

    if (users[i]._id == toUser) {
      ostTransactionModel.to_user_id = users[i].ost.id
    }
  }

  const result = await transactionService.execute(ostTransactionModel)
  console.log(result)
  return result
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

LikeService.prototype.like = async function({ fromUser, toUser }) {
  const users = await this.members.fetchBy({
    params: [{ _id: fromUser }, { _id: toUser }],
    fields: { ost: 1 },
  })

  await likeOstTransaction.call(this, fromUser, toUser, users)
  await updateLikeMember.call(this, fromUser, toUser)
}

LikeService.prototype.unlike = async function({ fromUser, toUser }) {
  const users = await this.members.fetchBy({
    params: [{ _id: fromUser }, { _id: toUser }],
    fields: { ost: 1 },
  })

  await likeOstTransaction.call(this, toUser, fromUser, users)
  await removeLikeMember.call(this, fromUser, toUser)
}

module.exports = (membersService, ostSdk, actionId) => {
  return new LikeService(membersService, ostSdk, actionId)
}
