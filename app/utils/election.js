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
  pickField,
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
  checkCreateParams: (mobile, password) => {
    if (!password || password.length > 16 || password.length < 3) {
      throw Error("password error")
    } else if (isNaN(mobile) || mobile.length != 11) {
      throw Error("mobile error")
    }
  },
  checkVoteLock: (pipelineResult, point) => {
    if (!pipelineResult || !pipelineResult[0] || pipelineResult[0][1]) {
      throw Error("没有获得锁")
    }

    if (!pipelineResult[1][1] || Number(pipelineResult[1][1]) < Number(point)) {
      throw Error("没有足够的票数")
    }
  },
  parseRank: (myRank) => {
    if (!isNaN(`${myRank}`)) {
      myRank = Number(myRank) + 1
    }

    return myRank || 0
  }
}
