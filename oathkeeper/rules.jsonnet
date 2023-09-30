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

local GenericAuthedBase = {
  version: version,
  authenticators: [cookie_session_authenticator],
  mutators: [id_token],
  authorizer: allow_authorizer,
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
    id: 'preflight',
    match: {
      methods: ['OPTIONS'],
      url: base_url + '/<.*>',
    },
    authenticators: [anonymous_authenticator],
    mutators: [noop_mutator],
    authorizer: allow_authorizer,
  },
  GenericAuthedBase
  {
    id: 'devices',
    match: {
      methods: ['GET', 'POST'],
      url: base_url + '/devices',
    },
  },
  GenericAuthedBase
  {
    id: 'delete_device',
    match: {
      methods: ['DELETE'],
      url: base_url + '/devices/<[a-zA-Z0-9-]+>',
    },
  },
  GenericAuthedBase
  {
    id: 'user',
    match: {
      methods: ['GET', 'PATCH'],
      url: base_url + '/user/me',
    },
  },
  GenericAuthedBase
  {
    id: 'plaid_link_token',
    match: {
      methods: ['GET'],
      url: base_url + '/plaid_link_token',
    },
  },
  GenericAuthedBase
  {
    id: 'plaid_link_token',
    match: {
      methods: ['GET'],
      url: base_url + '/plaid_link_token/<[a-zA-Z0-9]+>',
    },
  },
  GenericAuthedBase
  {
    id: 'plaid_token_exchange',
    match: {
      methods: ['POST'],
      url: base_url + '/plaid_token_exchange',
    },
  },
  GenericAuthedBase
  {
    id: 'plaid_items',
    match: {
      methods: ['GET'],
      url: base_url + '/plaid_items',
    },
  },
  GenericAuthedBase
  {
    id: 'plaid_item',
    match: {
      methods: ['DELETE', 'PATCH'],
      url: base_url + '/plaid_item/<[a-zA-Z0-9]+>',
    },
  },
  GenericAuthedBase
  {
    id: 'default_payment_method',
    match: {
      methods: ['GET', 'POST'],
      url: base_url + '/default_payment_method',
    },
  },
  GenericAuthedBase
  {
    id: 'customer',
    match: {
      methods: ['POST'],
      url: base_url + '/customer',
    },
  },
  GenericAuthedBase
  {
    id: 'subscription',
    match: {
      methods: ['POST'],
      url: base_url + '/subscription',
    },
  },
  GenericAuthedBase
  {
    id: 'update_subscription',
    match: {
      methods: ['POST', 'DELETE'],
      url: base_url + '/subscription/<[a-zA-Z0-9_]+>',
    }
  },
  GenericAuthedBase
  {
    id: 'subscription_item',
    match: {
      methods: ['PUT'],
      url: base_url + '/subscription_item',
    }
  },
  GenericAuthedBase
  {
    id: 'categories',
    match: {
      methods: ['POST', 'GET'],
      url: base_url + '/<(categories|category)>',
    }
  },
  GenericAuthedBase
  {
    id: 'bill',
    match: {
      methods: ['GET', 'POST'],
      url: base_url + '/<(bills|bill)>',
    },
  },
  GenericAuthedBase
  {
    id: 'transactions',
    match: {
      methods: ['POST'],
      url: base_url + '/transactions/sync',
    },
  },
  GenericAuthedBase
  {
    id: 'setup_intent',
    match: {
      methods: ['GET'],
      url: base_url + '/setup_intent',
    },
  },
  GenericAuthedBase
  {
    id: 'next_invoice',
    match: {
      methods: ['GET'],
      url: base_url + '/next_invoice',
    },
  },
  GenericAuthedBase
  {
    id: 'otp_create',
    match: {
      methods: ['POST'],
      url: base_url + '/otp',
    }
  },
  GenericAuthedBase
  {
    id: 'otp_verify',
    match: {
      methods: ['GET'],
      url: base_url + '/otp/<[a-zA-Z0-9-]+>',
    }
  }
]
