class UsersService {
  constructor(ost) {
    this.ost = ost
  }

  // Get specific user
  async get(id) {
    const res = await this.ost.services.users.get({ id })

    if (res.success) {
      return res
    }

    throw new Error(res.err.msg)
  }

  // List users
  async fetch({ page_no, airdropped, order_by, order, limit, id } = {}) {
    const res = await this.ost.services.users.list({
      page_no,
      airdropped,
      order_by,
      order,
      limit,
      id,
    })

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
  return new UsersService(ost)
}
