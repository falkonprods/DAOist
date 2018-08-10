const production = process.env.NODE_ENV === 'production'
if (!production) {
  require('dotenv').config('../../.env.production')
}
const fetch = require('node-fetch')

function shuffle(arr) {
  return arr
    .map(a => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value)
}

const processIds = fn => (n, arr) => {
  function random(n, arr) {
    if (n < 1) {
      return arr
    } else {
      fn(arr)
      return random(n - 1, shuffle(arr))
    }
  }

  return random(n, arr)
}

function callLikeTransaction(ids) {
  let likes = []
  let fromUser, toUser
  for (let i = 0; i < ids.length; i++) {
    if (i % 2) {
      fromUser = ids[i]
    } else {
      toUser = ids[i]
    }

    likes.push(
      fetch(`${process.env.VINZY_API_BASE_URL}/like?fromUser=${fromUser}&toUser=${toUser}`)
    )
  }

  Promise.all(likes)
    .then(results => console.log(results))
    .catch(error => console.log(error))
}

function run() {
  fetch(`${process.env.VINZY_API_BASE_URL}/members?limit=25`)
    .then(res => res.json())
    .then(json => json.members.map(member => member._id))
    .then(ids => processIds(callLikeTransaction)(20, ids))
    .catch(err => console.log(err))
}

run()
