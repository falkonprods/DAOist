class LedgerServicevice {
  constructor(ost) {
    this.ost = ost
  }

  // List user's transactions
  async fetch(id, { page_no, limit, order, order_by } = {}) {
    const res = await this.ost.services.ledger.get({ id, page_no, limit, order, order_by })

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
  return new LedgerServicevice(ost)
}
