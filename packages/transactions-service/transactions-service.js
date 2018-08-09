class TransactionsService {
  constructor(ost) {
    this.ost = ost
  }

  // List ALL transactions
  async list({ page_no, limit, order, order_by } = {}) {
    const res = await this.ost.services.transactions.list({ page_no, limit, order, order_by })

    if (res.success) {
      return res
    }

    throw new Error(res.err.msg)
  }

  // List transactions FROM the user
  async listFromUser(userID, { page_no, limit, order, order_by } = {}) {
    const res = await this.list({ page_no, limit, order, order_by })
    res.data.transactions = res.data.transactions.filter(t => t.from_user_id === userID)
    return res
  }

  // List transactions TO the user
  async listToUser(userID, { page_no, limit, order, order_by } = {}) {
    const res = await this.list({ page_no, limit, order, order_by })
    res.data.transactions = res.data.transactions.filter(t => t.to_user_id === userID)
    return res
  }

  // List transaction TO or FROM the user
  async listToOrFromUser(userID, { page_no, limit, order, order_by } = {}) {
    const res = await this.list({ page_no, limit, order, order_by })
    res.data.transactions = res.data.transactions.filter(t => {
      return t.to_user_id === userID || t.from_user_id === userID
    })
    return res
  }

  // Get specific transaction
  async get(id) {
    const res = await this.ost.services.transactions.get({ id })

    if (res.success) {
      return res
    }

    throw new Error(res.err.msg)
  }

  // Execute a transaction from a user to a user
  async execute(actionID, fromUser, toUser, users) {
    const ostTransactionModel = { from_user_id: null, to_user_id: null, action_id: actionID }

    for (let i = 0; i < users.length; i++) {
      if (users[i]._id == fromUser) {
        ostTransactionModel.from_user_id = users[i].ost.id
      }

      if (users[i]._id == toUser) {
        ostTransactionModel.to_user_id = users[i].ost.id
      }
    }

    const res = await this.ost.services.transactions.execute(ostTransactionModel)

    if (res.success) {
      console.log(res)
      return res
    }

    throw new Error(res.err.msg)
  }
}

/**
 * @param {*} ost
 */
module.exports = ost => {
  return new TransactionsService(ost)
}
