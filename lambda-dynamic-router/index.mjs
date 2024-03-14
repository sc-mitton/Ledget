exports.handler = async (event) => {
    const request = event.Records[0].cf.request
    const uri = request.uri
    const origin = request.origin

    const VERSION = 'v1'
    const accountsAppDomain = `accounts.ledget.app.${VERSION}`
    const appDomain = `app.ledget.${VERSION}`
    const landingDomain = `landing.${VERSION}`

    if (uri.endsWidth('accounts.ledget.app')) {
        // Route to the accounts bucket
        origin.s3.domainName = `${accountsAppDomain}.s3.amazonaws.com`
    } else if (uri.endsWith('ledget.app')) {
        // Route to the landing page bucket
        origin.s3.domainName = `${landingDomain}.s3.amazonaws.com`
    } else {
        // Route to the app bucket
        origin.s3.domainName = `${appDomain}.s3.amazonaws.com`
    }

    return request
}
