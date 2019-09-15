const jwt = require("jsonwebtoken")
let config = require("../config/jwt")

module.exports.verify = function (req, res, next) {
  let token = req.headers['authorization']
  /**
   * Check whether the token is provided in header
   * else return response with 401.
   */
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' })

  /**
   * Verify the token with the secret key
   */
  jwt.verify(token, config.secret, function (err) {
    /**
     * If the token is valid, check if the token
     * has not been expired else send 401 with code: 'TokenExpiredError'.
     */
    if (err && err.name === 'TokenExpiredError')
      return res.status(401).send({ code: 'TokenExpiredError', message: 'The token has been expired.' })

    /**
     * If the token is invalid, send 401.
     */
    if (err && err.name != 'TokenExpiredError')
      return res.status(401).send({ message: 'Failed to authenticate token.' })

    /**
     * If all the above conditions are false, move to next().
     */
    next()
  })
}