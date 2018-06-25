# Google Sign-in Service for NGINX http_auth_request

Authenticate nginx requests using Google Sign-in JWT tokens for specific
client IDs and domains.  Use it to secure other services or APIs that don't use
authentication, and where the client making the requests handles OAuth2 sign-in.

## How it Works

1. An incoming requests is made to the nginx server.
2. ngix internally sends the request to `jwtAuth` via the `http_auth_request_module`
3. `jwtAuth` checks the request for an "Authorization: Bearer <jwt-token>" header
   and returns 400 otherwise.
4. The token is verified with Google and decoded.  jwtAuth returns 401 is token is
   invalid.
5. If the decoded token has a valid client ID and domain, jwtAuth returns 200.
6. nginx completes the original request, or returns an error if unauthorized.

## Installation

Install jwtAuth and fire it up:

```
git clone https://github.com/abythell/jwtAuth.git
cd jwtAuth
npm install
```

Edit `auth.js` and set your Google API client ID, authorized domain, and port,
then start the service (`node auth.js`, or use pm2 or something fancy).  You can also
set the port on the command line (`PORT=1234 node auth.js`).

Then, assuming nginx has the http_auth_request module loaded, add `auth_request localhost:<PORT>`
to the appropriate `server` block to only allow requests with a valid JWT header.
Restart nginx and test it out.

## Resources

[Here's a good article](https://developers.shopware.com/blog/2015/03/02/sso-with-nginx-authrequest-module/)
about installing and using the http_auth_request module.

Details about Google JWT and more can be found on their [Google Sign-In for Websites]
(https://developers.google.com/identity/sign-in/web/backend-auth) page.
