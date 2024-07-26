import type { ConfigPlugin } from '@expo/config-plugins'
import { withMainApplication } from '@expo/config-plugins'

function applyPackage(mainApplication: string) {
  const plaidPackageImport = `import com.plaid.PlaidPackage;\n`
  const plaidAddPackage = `packages.add(new PlaidPackage());`

  // Make sure the project does not have the settings already
  if (!mainApplication.includes(plaidPackageImport)) {
    mainApplication = mainApplication.replace(
      /package com.ledget.mobileapp;/,
      `package com.ledget.mobileapp;\n${plaidPackageImport}`
    )
  }

  if (!mainApplication.includes(plaidAddPackage)) {
    mainApplication = mainApplication.replace(
      /return packages;/,
      `
    ${plaidAddPackage}
    return packages;
    `
    )
  }

  return mainApplication
}

const withAndroidPlaid: ConfigPlugin = (expoConfig) => {
  expoConfig = withMainApplication(expoConfig, (config) => {
    config.modResults.contents = applyPackage(config.modResults.contents)
    return config
  })

  return expoConfig
}

export default withAndroidPlaid
