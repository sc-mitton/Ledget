local version = 'v0.36.0-beta.4';
local ory_project = 'reverent-lewin-bqqp1o2zws';
local base_url = 'https://localhost/api/v1';

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

[
  Base
  {
    id: 'get_prices',
    match: {
      methods: ['GET'],
      url: base_url + '/prices',
    },
    authenticators: [anonymous_authenticator],
    mutators: [noop_mutator],
    authorizer: allow_authorizer,
  },
  Base
  {
    id: 'user',
    match: {
      methods: ['POST'],
      url: base_url + '/user/<[0-9a-zA-Z-]{20,40}>/<.*>',
    },
    authenticators: [cookie_session_authenticator],
    mutators: [id_token],
    authorizer: allow_authorizer,
  },
  Base
  {
    id: 'user',
    match: {
      methods: ['GET'],
      url: base_url + '/user/<.*>',
    },
    authenticators: [cookie_session_authenticator],
    mutators: [id_token],
    authorizer: allow_authorizer,
  },
  Base
  {
    id: 'preflight',
    match: {
      methods: ['OPTIONS'],
      url: base_url + '/<.*>',
    },
    authenticators: [anonymous_authenticator],
    mutators: [noop_mutator],
    authorizer: allow_authorizer,
  },
]
