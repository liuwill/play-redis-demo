
export default {
  parseErrorCode: (err) => {
    let status = 500
    if (err) {
      status = err.statusCode || err.status || status
    }
    return status
  }
}
