local version = 'v0.36.0-beta.4';
local base_url = 'https://' + std.extVar('domain') + '/v' + std.extVar('version');

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
      methods: ['GET'],
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
      methods: ['GET'],
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
  BaseWithAuth
  {
    id: 'devices',
    match: {
      methods: ['GET', 'POST'],
      url: base_url + '/devices',
    },
  },
  BaseWithAuth
  {
    id: 'delete_device',
    match: {
      methods: ['DELETE'],
      url: base_url + '/device/<[a-zA-Z0-9-]+>',
    },
  },
  BaseWithAuth
  {
    id: 'user',
    match: {
      methods: ['GET', 'PATCH'],
      url: base_url + '/user/me',
    },
  },
  BaseWithAuth
  {
    id: 'email_user',
    match: {
      methods: ['POST'],
      url: base_url + '/user/email',
    },
  },
  BaseWithAuth
  {
    id: 'plaid_link_token',
    match: {
      methods: ['GET'],
      url: base_url + '/plaid_link_token',
    },
  },
  BaseWithAuth
  {
    id: 'plaid_link_token',
    match: {
      methods: ['GET'],
      url: base_url + '/plaid_link_token/<[a-zA-Z0-9]+>',
    },
  },
  BaseWithAuth
  {
    id: 'plaid_token_exchange',
    match: {
      methods: ['POST'],
      url: base_url + '/plaid_token_exchange',
    },
  },
  BaseWithAuth
  {
    id: 'plaid_items',
    match: {
      methods: ['GET'],
      url: base_url + '/plaid_items',
    },
  },
  BaseWithAuth
  {
    id: 'plaid_item',
    match: {
      methods: ['DELETE', 'PATCH'],
      url: base_url + '/plaid_item/<[a-zA-Z0-9]+>',
    },
  },
  BaseWithAuth
  {
    id: 'default_payment_method',
    match: {
      methods: ['GET', 'POST'],
      url: base_url + '/default_payment_method',
    },
  },
  BaseWithAuth
  {
    id: 'customer',
    match: {
      methods: ['POST'],
      url: base_url + '/customer',
    },
  },
  BaseWithAuth
  {
    id: 'subscription',
    match: {
      methods: ['POST', 'GET'],
      url: base_url + '/subscription',
    },
  },
  BaseWithAuth
  {
    id: 'update_subscription',
    match: {
      methods: ['POST', 'DELETE'],
      url: base_url + '/subscription/<[a-zA-Z0-9_]+>',
    },
  },
  BaseWithAuth
  {
    id: 'subscription_item',
    match: {
      methods: ['PUT'],
      url: base_url + '/subscription_item',
    },
  },
  BaseWithAuth
  {
    id: 'categories',
    match: {
      methods: ['POST', 'GET', 'PATCH'],
      url: base_url + '/<(categories|category)>',
    },
  },
  BaseWithAuth
  {
    id: 'delete_categories',
    match: {
      methods: ['DELETE'],
      url: base_url + '/categories/items',
    },
  },
  BaseWithAuth
  {
    id: 'update_category',
    match: {
      methods: ['PUT', 'PATCH'],
      url: base_url + '/categories/<[a-zA-Z0-9-]+>',
    },
  },
  BaseWithAuth
  {
    id: 'spending_history',
    match: {
      methods: ['GET'],
      url: base_url + '/categories/<[a-zA-Z0-9-]+>/spending-history',
    },
  },
  BaseWithAuth
  {
    id: 'order',
    match: {
      methods: ['POST'],
      url: base_url + '/categories/order',
    },
  },
  BaseWithAuth
  {
    id: 'bills',
    match: {
      methods: ['GET', 'POST'],
      url: base_url + '/<(bills|bill)>',
    },
  },
  BaseWithAuth
  {
    id: 'update_bill',
    match: {
      methods: ['PUT', 'PATCH'],
      url: base_url + '/bills/<[a-zA-Z0-9-]+>',
    },
  },
  BaseWithAuth
  {
    id: 'delete_bills',
    match: {
      methods: ['DELETE'],
      url: base_url + '/bills/<[a-zA-Z0-9-]+>',
    },
  },
  BaseWithAuth
  {
    id: 'sync_transactions',
    match: {
      methods: ['POST'],
      url: base_url + '/transactions/sync',
    },
  },
  BaseWithAuth
  {
    id: 'transactions',
    match: {
      methods: ['GET'],
      url: base_url + '/transactions',
    },
  },
  BaseWithAuth
  {
    id: 'transactions_count',
    match: {
      methods: ['GET'],
      url: base_url + '/transactions/count',
    },
  },
  BaseWithAuth
  {
    id: 'recurring_transactions',
    match: {
      methods: ['GET'],
      url: base_url + '/transactions/recurring/get',
    },
  },
  BaseWithAuth
  {
    id: 'update_transaction',
    match: {
      methods: ['PATCH'],
      url: base_url + '/transactions/<[a-zA-Z0-9-]+>',
    },
  },
  BaseWithAuth
  {
    id: 'confirm_transactions',
    match: {
      methods: ['POST'],
      url: base_url + '/transactions/confirmation',
    },
  },
  BaseWithAuth
  {
    id: 'merchants',
    match: {
      methods: ['GET'],
      url: base_url + '/transactions/merchants',
    },
  },
  BaseWithAuth
  {
    id: 'add_note',
    match: {
      methods: ['POST'],
      url: base_url + '/transactions/<[a-zA-Z0-9-]+>/note',
    },
  },
  BaseWithAuth
  {
    id: 'update_delete_note',
    match: {
      methods: ['PUT', 'DELETE'],
      url: base_url + '/transactions/<[a-zA-Z0-9-]+>/note/<[a-zA-Z0-9-]+>',
    },
  },
  BaseWithAuth
  {
    id: 'setup_intent',
    match: {
      methods: ['GET'],
      url: base_url + '/setup_intent',
    },
  },
  BaseWithAuth
  {
    id: 'next_invoice',
    match: {
      methods: ['GET'],
      url: base_url + '/next_invoice',
    },
  },
  BaseWithAuth
  {
    id: 'accounts',
    match: {
      methods: ['GET', 'PATCH'],
      url: base_url + '/accounts',
    },
  },
  BaseWithAuth
  {
    id: 'reminders',
    match: {
      methods: ['GET'],
      url: base_url + '/reminders',
    },
  },
]
