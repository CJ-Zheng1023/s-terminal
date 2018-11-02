let crypto = require('crypto')
export default {
  idGenerator () {
    let buf = crypto.randomBytes(16)
    return buf.toString('hex')
  }
}
