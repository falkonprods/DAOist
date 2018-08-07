class TokenService {
  constructor(ost) {
    this.ost = ost
  }

  // Fetch FULL branded token details
  async fetch() {
    const res = await this.ost.services.token.get({})

    if (res.success) {
      return res
    }

    throw new Error(res.err.msg)
  }

  // Fetch branded token details
  async fetchFiltered() {
    const res = await this.fetch()
    res.data = filter(res.data)
    return res
  }
}

// Filter out sensitive information
function filter(t) {
  const filters = new Map([
    [
      'token',
      [
        'name',
        'symbol',
        'symbol_icon',
        'total_supply',
        'company_uuid',
        'ost_utility_balance',
        'token_erc20_address',
        'airdrop_contract_address',
        'simple_stake_contract_address',
      ],
    ],
    ['result_type', []],
  ])

  for (const [key, values] of filters) {
    if (filters.get(key).length) {
      for (const item of values) {
        delete t[key][item]
      }
    } else {
      delete t[key]
    }
  }

  return t
}

/**
 * @param {*} ost
 */
module.exports = ost => {
  return new TokenService(ost)
}
