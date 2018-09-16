export default {
  generateVoterPointsKey: (mobile) => {
    return `voter:score:${mobile}`
  }
}
