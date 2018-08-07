class BalanceService {
  constructor(ost) {
    this.ost = ost
  }
  async fetch(userID) {
    const res = await this.ost.services.balances.get({ id: userID })

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
  return new BalanceService(ost)
}
