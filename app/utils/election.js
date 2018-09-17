function pickField(data, fields) {
  if (!data || typeof data !== 'object') {
    return data
  }

  let target = {}
  for (let key of fields) {
    target[key] = data[key]
  }

  return target
}

export default {
  generateVoterPointsKey: (mobile) => {
    return `voter:score:${mobile}`
  },
  generateVoterLockKey: (mobile) => {
    return `voter:lock:${mobile}`
  },
  generateElectorVoteKey: (mobile) => {
    return `election:vote:${mobile}`
  },
  buildElectorData: (data) => {
    const fields = ['id', 'mobile', 'email', 'address', 'name', 'mascot', 'description', 'avatar', 'company', 'profession', 'created']
    return pickField(data, fields)
  },
  buildVoteData: (data) => {
    const fields = ['id', 'mobile', 'email', 'address', 'name', 'created', 'point']
    return pickField(data, fields)
  },
}
