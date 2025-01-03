const { AndroidConfig, withAndroidManifest } = require('@expo/config-plugins');
const { Paths } = require('@expo/config-plugins/build/android');
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const { getMainApplicationOrThrow } = AndroidConfig.Manifest;

const withTrustLocalCerts = (config) => {
  config = withAndroidManifest(config, async (config) => {
    config.modResults = await setCustomConfigAsync(config, config.modResults);
    return config;
  });
  config = withAndroidManifest(config, async (config) => {
    config.modResults = await setSelfSignedCertAsync(config, config.modResults);
    return config;
  });
  return config;
};

async function setSelfSignedCertAsync(config, androidManifest) {
  const srcDir = path.join(__dirname, '..', '..', '..', 'certs');
  const src_file_pat = path.join(srcDir, 'ledgetca.pem');
  const res_file_path = path.join(
    await Paths.getResourceFolderAsync(config.modRequest.projectRoot),
    'raw',
    'ledgetca'
  );

  const res_dir = path.resolve(res_file_path, '..');

  if (!fs.existsSync(res_dir)) {
    await fsPromises.mkdir(res_dir);
  }

  try {
    await fsPromises.copyFile(src_file_pat, res_file_path);
  } catch (e) {
    throw e;
  }

  return androidManifest;
}

async function setCustomConfigAsync(config, androidManifest) {
  const src_file_pat = path.join(__dirname, 'network_security_config.xml');
  const res_file_path = path.join(
    await Paths.getResourceFolderAsync(config.modRequest.projectRoot),
    'xml',
    'network_security_config.xml'
  );

  const res_dir = path.resolve(res_file_path, '..');

  if (!fs.existsSync(res_dir)) {
    await fsPromises.mkdir(res_dir);
  }

  try {
    await fsPromises.copyFile(src_file_pat, res_file_path);
  } catch (e) {
    throw e;
  }

  const mainApplication = getMainApplicationOrThrow(androidManifest);
  mainApplication.$['android:networkSecurityConfig'] =
    '@xml/network_security_config';

  return androidManifest;
}

module.exports = withTrustLocalCerts;
