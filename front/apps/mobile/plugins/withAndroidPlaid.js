const { withAppBuildGradle, withSettingsGradle } = require('@expo/config-plugins')

function applyImplementation(appBuildGradle) {
    const plaidImplementation = `implementation project(':react-native-plaid-link-sdk')`;

    // Make sure the project does not have the dependency already
    if (!appBuildGradle.includes(plaidImplementation)) {
        return appBuildGradle.replace(
            /dependencies\s?{/,
            `dependencies {
    ${plaidImplementation}`
        );
    }

    return appBuildGradle;
}

function applySettings(gradleSettings) {
    const plaidSettings = `include ':react-native-plaid-link-sdk'` + '\n' +
        `project(':react-native-plaid-link-sdk').projectDir = new File(rootProject.projectDir, '../../../node_modules/react-native-plaid-link-sdk/android')`

    // Make sure the project does not have the settings already
    if (!gradleSettings.includes(`include ':react-native-plaid-link-sdk'`)) {
        return gradleSettings + plaidSettings
    }

    return gradleSettings
}

const withAndroidPlaid = (expoConfig) => {

    expoConfig = withAppBuildGradle(expoConfig, (config) => {
        config.modResults.contents = applyImplementation(config.modResults.contents)
        return config
    })

    expoConfig = withSettingsGradle(expoConfig, (config) => {
        config.modResults.contents = applySettings(config.modResults.contents)
        return config
    })

    return expoConfig
}

module.exports = withAndroidPlaid
