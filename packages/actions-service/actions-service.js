class ActionsService {
  constructor(ost) {
    this.ost = ost
  }

  // List actions
  async list({ page_no, limit, order, order_by, id, name, kind, arbitrary_amount } = {}) {
    const res = await this.ost.services.actions.list({
      page_no,
      limit,
      order,
      order_by,
      id,
      name,
      kind,
      arbitrary_amount,
    })

    if (res.success) {
      return res
    }

    throw new Error(res.err.msg)
  }

  // Get a specific action
  async get(id) {
    const res = await this.ost.services.actions.get({ id })

    if (res.success) {
      return res
    }

    throw new Error(res.err.msg)
  }
}

/**
 * @param {*} ost
 */
module.exports = ost => {
  return new ActionsService(ost)
}
