const production = process.env.NODE_ENV === 'production'
if (!production) {
  require('dotenv').config('../../.env.production')
}
const mongo = require('mongo')
const membersService = require('./../index')(mongo)

membersService
  .fetchBy({
    params: [{ _id: '5b073da0440aa131b006fd59' }, { _id: '5b073d7d440aa131b006fd42' }],
    fields: { ost: 1 },
  })
  .then(resp => console.log(resp))
  .catch(e => console.log(e))
