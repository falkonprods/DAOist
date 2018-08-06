class BlanaceService {
  constructor(ost) {
    this.ost = ost
  }
  async fetch(userID) {
    const res = await this.ost.services.balance.get({ id: userID })

    if (res.success) {
      return res
    }

    throw new Error(res.err.msg)
  }
}
/**
 * @param {*} ost
 * @param {String} mongo
 */
module.exports = ost => {
  return new BlanaceService(ost)
}
