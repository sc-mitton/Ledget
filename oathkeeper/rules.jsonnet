local version = "v0.36.0-beta.4";
local base_url = "https://" + std.extVar("domain");
local v = std.parseInt(std.extVar("version"));
local api_version_regex = if v > 1
then std.format("<%s|", v - 1) + std.format("%s>", v)
else std.format("<%s>", v);
local base_versioned_url = base_url + "/v" + api_version_regex;

/* Authenticators */
local anonymous_authenticator = {
  handler: "anonymous",
};
local cookie_session_authenticator = {
  handler: "cookie_session",
};
local bearer_token_authenticator = {
  handler: "bearer_token",
};
local noop_authenticator = {
  handler: "noop",
};

/* Authorizors */
local allow_authorizer = { handler: "allow" };

/* Mutators */
local id_token = { handler: "id_token" };
local token_header = { handler: "header" };
local noop_mutator = { handler: "noop" };

/* ---------------------------------- Rules --------------------------------- */

local Base = {
  version: version,
};

local BaseWithAuth = {
  version: version,
  authenticators: [cookie_session_authenticator, bearer_token_authenticator],
  mutators: [id_token, token_header],
  authorizer: allow_authorizer,
};

[
  Base
  {
    id: "get-prices",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/prices",
    },
    authenticators: [noop_authenticator],
    mutators: [noop_mutator],
    authorizer: allow_authorizer,
  },
  Base
  {
    id: "preflight",
    match: {
      methods: ["OPTIONS"],
      url: base_versioned_url + "/<.*>",
    },
    authenticators: [anonymous_authenticator],
    mutators: [noop_mutator],
    authorizer: allow_authorizer,
  },
  Base
  {
    id: "extend-token-session",
    match: {
      methods: ["PATCH"],
      url: base_versioned_url + "/user/token-session/<[a-zA-Z0-9-]+>/extend",
    },
    authenticators: [bearer_token_authenticator],
    mutators: [id_token, token_header],
    authorizer: allow_authorizer,
  },
  BaseWithAuth
  {
    id: "extend-session",
    match: {
      methods: ["PATCH"],
      url: base_versioned_url + "/user/session/extend",
    },
  },
  BaseWithAuth
  {
    id: "disabled-session",
    match: {
      methods: ["DELETE"],
      url: base_versioned_url + "/user/session",
    },
  },
  BaseWithAuth
  {
    id: "logout-all-sessions",
    match: {
      methods: ["DELETE"],
      url: base_versioned_url + "/user/sessions",
    },
  },
  BaseWithAuth
  {
    id: "devices",
    match: {
      methods: ["GET", "POST"],
      url: base_versioned_url + "/devices",
    },
  },
  BaseWithAuth
  {
    id: "delete-device",
    match: {
      methods: ["DELETE"],
      url: base_versioned_url + "/device/<[a-zA-Z0-9-]+>",
    },
  },
  BaseWithAuth
  {
    id: "user",
    match: {
      methods: ["GET", "PATCH"],
      url: base_versioned_url + "/user/me",
    },
  },
  BaseWithAuth
  {
    id: "user-settings",
    match: {
      methods: ["GET", "PATCH"],
      url: base_versioned_url + "/user/settings",
    },
  },
  BaseWithAuth
  {
    id: "co-owner",
    match: {
      methods: ["GET", "DELETE"],
      url: base_versioned_url + "/user/co-owner",
    },
  },
  BaseWithAuth
  {
    id: "account",
    match: {
      methods: ["POST"],
      url: base_versioned_url + "/user/account",
    },
  },
  BaseWithAuth
  {
    id: "email-user",
    match: {
      methods: ["POST"],
      url: base_versioned_url + "/user/email",
    },
  },
  BaseWithAuth
  {
    id: "plaid-link-token",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/plaid-link-token",
    },
  },
  BaseWithAuth
  {
    id: "plaid-link-token",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/plaid-link-token/<[a-zA-Z0-9]+>",
    },
  },
  BaseWithAuth
  {
    id: "plaid-token-exchange",
    match: {
      methods: ["POST"],
      url: base_versioned_url + "/plaid-token-exchange",
    },
  },
  BaseWithAuth
  {
    id: "plaid-items",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/plaid-items",
    },
  },
  BaseWithAuth
  {
    id: "plaid-item",
    match: {
      methods: ["DELETE", "GET"],
      url: base_versioned_url + "/plaid-item/<[a-zA-Z0-9]+>",
    },
  },
  BaseWithAuth
  {
    id: "default-payment-method",
    match: {
      methods: ["GET", "POST"],
      url: base_versioned_url + "/default-payment-method",
    },
  },
  BaseWithAuth
  {
    id: "customer",
    match: {
      methods: ["POST"],
      url: base_versioned_url + "/customer",
    },
  },
  BaseWithAuth
  {
    id: "subscription",
    match: {
      methods: ["POST", "GET"],
      url: base_versioned_url + "/subscription",
    },
  },
  BaseWithAuth
  {
    id: "update-subscription",
    match: {
      methods: ["POST", "DELETE"],
      url: base_versioned_url + "/subscription/<[a-zA-Z0-9_]+>",
    },
  },
  BaseWithAuth
  {
    id: "subscription-item",
    match: {
      methods: ["PUT"],
      url: base_versioned_url + "/subscription-item",
    },
  },
  BaseWithAuth
  {
    id: "categories",
    match: {
      methods: ["POST", "GET", "PATCH"],
      url: base_versioned_url + "/<(categories|category)>",
    },
  },
  BaseWithAuth
  {
    id: "delete-categories",
    match: {
      methods: ["DELETE"],
      url: base_versioned_url + "/categories/items",
    },
  },
  BaseWithAuth
  {
    id: "update-category",
    match: {
      methods: ["PUT", "PATCH"],
      url: base_versioned_url + "/categories/<[a-zA-Z0-9-]+>",
    },
  },
  BaseWithAuth
  {
    id: "spending-history",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/categories/<[a-zA-Z0-9-]+>/spending-history",
    },
  },
  BaseWithAuth
  {
    id: "order",
    match: {
      methods: ["POST"],
      url: base_versioned_url + "/categories/order",
    },
  },
  BaseWithAuth
  {
    id: "bills",
    match: {
      methods: ["GET", "POST"],
      url: base_versioned_url + "/<(bills|bill)>",
    },
  },
  BaseWithAuth
  {
    id: "update-bill",
    match: {
      methods: ["PUT", "PATCH"],
      url: base_versioned_url + "/bills/<[a-zA-Z0-9-]+>",
    },
  },
  BaseWithAuth
  {
    id: "delete-bills",
    match: {
      methods: ["DELETE"],
      url: base_versioned_url + "/bills/<[a-zA-Z0-9-]+>",
    },
  },
  BaseWithAuth
  {
    id: "sync-transactions",
    match: {
      methods: ["POST"],
      url: base_versioned_url + "/transactions/sync",
    },
  },
  BaseWithAuth
  {
    id: "transactions",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/transactions",
    },
  },
  BaseWithAuth
  {
    id: "transactions-count",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/transactions/count",
    },
  },
  BaseWithAuth
  {
    id: "recurring-transactions",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/transactions/recurring",
    },
  },
  BaseWithAuth
  {
    id: "update-transaction",
    match: {
      methods: ["PATCH"],
      url: base_versioned_url + "/transactions/<[a-zA-Z0-9-]+>",
    },
  },
  BaseWithAuth
  {
    id: "confirm-transactions",
    match: {
      methods: ["POST"],
      url: base_versioned_url + "/transactions/confirmation",
    },
  },
  BaseWithAuth
  {
    id: "merchants",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/transactions/merchants",
    },
  },
  BaseWithAuth
  {
    id: "add-note",
    match: {
      methods: ["POST"],
      url: base_versioned_url + "/transactions/<[a-zA-Z0-9-]+>/note",
    },
  },
  BaseWithAuth
  {
    id: "update-delete-note",
    match: {
      methods: ["PUT", "DELETE"],
      url: base_versioned_url + "/transactions/<[a-zA-Z0-9-]+>/note/<[a-zA-Z0-9-]+>",
    },
  },
  BaseWithAuth
  {
    id: "setup-intent",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/setup-intent",
    },
  },
  BaseWithAuth
  {
    id: "next-invoice",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/next-invoice",
    },
  },
  BaseWithAuth
  {
    id: "accounts",
    match: {
      methods: ["GET", "PATCH"],
      url: base_versioned_url + "/accounts",
    },
  },
  BaseWithAuth
  {
    id: "liabilities",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/liabilities",
    },
  },
  BaseWithAuth
  {
    id: "investments",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/investments",
    },
  },
  BaseWithAuth
  {
    id: "account-balance-history",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/accounts/balance-history",
    },
  },
  BaseWithAuth
  {
    id: "investments-balance-history",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/investments/balance-history",
    },
  },
  BaseWithAuth
  {
    id: "breakdown-history",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/accounts/breakdown-history",
    },
  },
  BaseWithAuth
  {
    id: "account-balance-trend",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/accounts/balance-trend",
    },
  },
  BaseWithAuth
  {
    id: "reminders",
    match: {
      methods: ["GET"],
      url: base_versioned_url + "/reminders",
    },
  },
  BaseWithAuth
  {
    id: "setup-intent",
    match: {
      methods: ["POST"],
      url: base_versioned_url + "/setup-intent",
    },
  },
]
