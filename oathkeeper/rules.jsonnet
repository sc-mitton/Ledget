local version = 'v0.36.0-beta.4';
local ory_project = 'reverent-lewin-bqqp1o2zws';
local base_url = 'https://ledget.app:8000';

local ledget_upstream = {
    url: 'https://ledget.app:8000',
    preserve_host: false,
    strip_path: '/api/v1'
};

/* Authenticators */
local noop_authenticator = {
    "handler": "noop",
    "config": {}
};

local cookie_session_authenticator = {
    handler: 'cookie_session',
    config: {
        check_session_url: "https://" + ory_project + ".projects.oryapis.com/sessions/whoami",
        only: ['session_id'],
    },
};

/* Authorizors */
local allow_authorizer = {
    handler: 'allow',
    config: {},
};

/* Mutators */
local jwt_mutator = {
    handler: "id_token",
    config: {
        ttl: '60s'
    }
};

local noop_mutator = {
    handler: "noop",
};

/* ---------------------------------- Rules --------------------------------- */

local Base = {
    version: version,
    upstream: ledget_upstream,
};


[
    Base +
    {
        id: 'get_prices',
        match: {
            methods: ['GET'],
            url: base_url + '/prices'
        },
        authenticators: [noop_authenticator],
    },
]
