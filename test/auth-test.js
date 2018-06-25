/* eslint-env mocha */

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const proxy = require('../auth.js')
chai.use(chaiHttp)
chai.use(expect)

describe('Proxy', () => {
  it('returns 400 if token missing', () => {
    return chai.request(proxy).get('/').then((res) => {
      expect(res).to.have.status(400)
    })
  })

  it('returns 400 if token has invalid format', () => {
    return chai.request(proxy).get('/').set('token', 'some-jwt-token-without-bearer').then((res) => {
      expect(res).to.have.status(400)
    })
  })
})
