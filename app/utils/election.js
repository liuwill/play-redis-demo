function pickField(data, fields) {
  if (!data || typeof data !== 'object') {
    return data
  }

  let target = {}
  for (let key in data) {
    target[key] = data[key]
  }

  return target
}

export default {
  generateVoterPointsKey: (mobile) => {
    return `voter:score:${mobile}`
  },
  buildElectorData: (data) => {
    const fields = ['mobile', 'email', 'address', 'name', 'mascot', 'description', 'avatar', 'company', 'profession', 'created']
    return pickField(data, fields)
  },
  buildVoteData: (data) => {
    const fields = ['mobile', 'email', 'address', 'name', 'created']
    return pickField(data, fields)
  },
}
