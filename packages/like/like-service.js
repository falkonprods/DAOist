class LikeService {
  constructor(members, ost) {
    this.members = members
    this.ost = ost
  }
}

LikeService.prototype.like = async function({ fromUser, toUser, actionId }) {
  const users = await this.members.fetchBy({
    params: [{ _id: fromUser }, { _id: toUser }],
    fields: { ost: 1 },
  })

  const transactionService = this.ost.services.transactions

  // const result = await transactionService.execute({from_user_id:'0a201640-77a7-49c8-b289-b6b5d7325323', to_user_id:'24580db2-bf29-4d73-bf5a-e1d0cf8c8928', action_id:'22599'})


}

/**
 * @param {*} membersService
 * @param {*} ostSdk
 */
module.exports = (membersService, ostSdk) => {
  return new LikeService(membersService, ostSdk)
}
