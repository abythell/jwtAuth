const {OAuth2Client} = require('google-auth-library')
const express = require('express')
const config = require('./config.json')

let port = process.env.PORT || config.port || 8080
let client = new OAuth2Client(config.clientId)
let app = express()

app.use('/', (req, res) => {
  let authorization = req.get('Authorization')
  if (!authorization) return res.status(403).send('Bad/missing Authorization header.')
  let token = authorization.split(' ')[1] // "Bearer <JWT>"
  if (!token) return res.status(403).send('Invalid Authorization header format.')
  client.verifyIdToken({idToken: token, audience: config.clientId}).then((ticket) => {
    let payload = ticket.getPayload()
    if (payload['hd'] !== config.domain) return res.status(401).send('Unauthorized domain.')
    else return res.status(200).send('Authorized')
  }).catch((err) => {
    return res.status(403).send(err.message)
  })
})

app.listen(port, () => {
  console.log('Listening on port ' + port)
})

/** Export module for testing with chai-http */
module.exports = app
