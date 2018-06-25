const {OAuth2Client} = require('google-auth-library')
const express = require('express')

/** user-defined settings */
const port = process.env.PORT || 8080 // set port here or using PORT env. variable
const CLIENT_ID = 'your-client-id.apps.googleusercontent.com' // create on Google Cloud Platform
const AUTHORIZED_DOMAIN = 'your-domain.com' // only users signed into this domain will be allowed

let client = new OAuth2Client(CLIENT_ID)
let app = express()

app.use('/', (req, res) => {
  let authorization = req.get('Authorization')
  if (!authorization) return res.status(400).send('Bad/missing Authorization header.')
  let token = authorization.split(' ')[1] // "Bearer <JWT>"
  if (!token) return res.status(400).send('Invalid Authorization header format.')
  client.verifyIdToken({idToken: token, audience: CLIENT_ID}).then((ticket) => {
    let payload = ticket.getPayload()
    if (payload['hd'] !== AUTHORIZED_DOMAIN) return res.status(401).send('Unauthorized domain.')
  }).catch((err) => {
    return res.status(401).send(err.message)
  })
})

app.listen(port, () => {
  console.log('Listening on port ' + port)
})

/** Export module for testing with chai-http */
module.exports = app
