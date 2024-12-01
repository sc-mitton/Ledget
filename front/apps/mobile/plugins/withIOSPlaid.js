const { withPodfile } = require('@expo/config-plugins')

function applyPlaidVersion(appPodFile) {
    const plaidImplementation = `pod 'Plaid', '~> 5.6.0'`;
    const deploymentTarget = '16.0';

    if (!appPodFile.includes(plaidImplementation)) {
        appPodFile = appPodFile.replace(
            /target\s'Ledget'\sdo/,
            `target 'Ledget' do\n  ${plaidImplementation}`
        );
    };

    const r = /(platform.*:ios.*)'[0-9.]+'/;
    appPodFile = appPodFile.replace(r, `$1'${deploymentTarget}'`);
    return appPodFile;
}

const withAndroidPlaid = (expoConfig) => {
    expoConfig = withPodfile(expoConfig, (config) => {
        config.modResults.contents = applyPlaidVersion(config.modResults.contents)
        return config
    })

    return expoConfig
}

module.exports = withAndroidPlaid
