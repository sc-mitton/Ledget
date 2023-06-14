local version = 'v0.36.0-beta.4';
local ory_project = 'reverent-lewin-bqqp1o2zws';
local base_url = 'https://ledget.app/api/v1';

/* Authenticators */
local anonymous_authenticator = {
  handler: 'anonymous',
};
local cookie_session_authenticator = {
  handler: 'cookie_session',
  config: {
    check_session_url: 'https://' + ory_project + '.projects.oryapis.com/sessions/whoami',
    only: ['session_id'],
  },
};

/* Authorizors */
local allow_authorizer = { handler: 'allow' };
local deny_authorizer = { handler: 'deny' };

/* Mutators */
local jwt_mutator = {
  handler: 'id_token',
  config: {
    ttl: '60s',
  },
};

local noop_mutator = { handler: 'noop' };

/* ---------------------------------- Rules --------------------------------- */

local Base = {
  version: version,
};

[
  Base
  {
    upstream: {
      url: base_url + '/prices',
    },
    id: 'get_prices',
    match: {
      methods: ['GET'],
      url: base_url + '/prices',
    },
    authenticators: [anonymous_authenticator],
    mutators: [noop_mutator],
    authorizer: allow_authorizer,
  },
  {
    upstream: {
      url: base_url + '/hooks/ory',
    },
    id: 'ory_hook',
    match: {
      methods: ['POST'],
      url: base_url + '/hooks/ory',
    },
    authenticators: [anonymous_authenticator],
    mutators: [noop_mutator],
    authorizer: allow_authorizer,
  },
]
