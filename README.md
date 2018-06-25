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

```
git clone https://github.com/abythell/jwtAuth.git
cd jwtAuth
npm install
cp config.json sample config.json
```

Edit `config.json` and set your Google API client ID, authorized domain, and port.
Get or create a client ID via the [Google Cloud Platform](https://console.cloud.google.com/apis).

Start the service (`node auth.js`, or use pm2 or something fancy).

Then, configure nginx to authorize requests by sending sub-requests to the jwtAuth
service.  [Here's a good article](https://developers.shopware.com/blog/2015/03/02/sso-with-nginx-authrequest-module/)
about installing and using the http_auth_request module.
