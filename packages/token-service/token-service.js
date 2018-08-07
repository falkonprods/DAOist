class TokenService {
  constructor(ost) {
    this.ost = ost
  }

  // Fetch branded token details
  async fetch() {
    const res = await this.ost.services.token.get({})

    if (res.success) {
      res.data.token = filter(res.data.token)
      return res
    }

    throw new Error(res.err.msg)
  }
}

function filter(t) {
  const filterKeys = [
    'company_uuid',
    'token_erc20_address',
    'airdrop_contract_address',
    'simple_stake_contract_address',
  ]

  for (const key of filterKeys) {
    delete t[key]
  }

  return t
}

/**
 * @param {*} ost
 */
module.exports = ost => {
  return new TokenService(ost)
}
