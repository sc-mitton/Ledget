document.getElementsByName("webauthn_register_trigger").forEach((v) => {
    v.addEventListener("click", () => {
        window.__oryWebAuthnRegistration({
            "publicKey": {
                "challenge": "jaF5wNGP72vP9Nzp3KXPuKkL3ubf6owAlIo2dKl9GC4=",
                "rp": {
                    "name": "passkey-demo",
                    "id": "pedantic-wright-03evpziv3q.projects.oryapis.com"
                },
                "user": {
                    "name": "passkey-demo",
                    "displayName": "passkey-demo",
                    "id": "LoD9vMaNQ+ahv8Gphxc15Q=="
                }, "pubKeyCredParams": [{
                    "type": "public-key",
                    "alg": -7
                }, {
                    "type": "public-key",
                    "alg": -35
                }, {
                    "type": "public-key",
                    "alg": -36
                }, {
                    "type": "public-key",
                    "alg": -257
                }, {
                    "type": "public-key",
                    "alg": -258
                }, {
                    "type": "public-key",
                    "alg": -259
                }, {
                    "type": "public-key",
                    "alg": -37
                }, {
                    "type": "public-key",
                    "alg": -38
                }, {
                    "type": "public-key",
                    "alg": -39
                }, {
                    "type": "public-key",
                    "alg": -8
                }],
                "authenticatorSelection": {
                    "userVerification": "discouraged"
                },
                "timeout": 60000
            }
        })
    })
})
