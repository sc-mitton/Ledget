
local version = 'v0.36.0-beta.4';
local base_url = 'https://localhost';

/* Authenticators */
local anonymous_authenticator = {
  handler: 'anonymous',
};
local cookie_session_authenticator = {
  handler: 'cookie_session',
  forward_http_headers: [
    'X-Forwarded-For',
    'Authorization',
  ],
};

/* Authorizors */
local allow_authorizer = { handler: 'allow' };
local deny_authorizer = { handler: 'deny' };

/* Mutators */
local id_token = {
  handler: 'id_token',
};
local noop_mutator = { handler: 'noop' };

/* ---------------------------------- Rules --------------------------------- */

local Base = {
  version: version,
};

local BaseWithAuth = {
  version: version,
  authenticators: [cookie_session_authenticator],
  mutators: [id_token],
  authorizer: allow_authorizer,
};

[
  Base
  {
    id: 'allow-anonymous',
    match: {
      methods: ['Get'],
      url: base_url + '/allow-anonymous',
    },
    authenticators: [anonymous_authenticator],
    mutators: [noop_mutator],
    authorizer: allow_authorizer,
  },
  Base
  {
    id: 'deny-anonymous',
    match: {
      methods: ['Get'],
      url: base_url + '/deny-anonymous',
    },
    authenticators: [anonymous_authenticator],
    authorizer: deny_authorizer,
    mutators: [noop_mutator],
  },
  BaseWithAuth
  {
    id: 'allow-with-auth',
    match: {
      methods: ['Get'],
      url: base_url + '/allow-with-auth',
    },
  },
]
