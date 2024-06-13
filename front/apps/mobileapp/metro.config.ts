const { withNxMetro } = require('@nx/expo');
const { getDefaultConfig } = require('@expo/metro-config');
const { sourceExts, assetExts } = require('metro-config/src/defaults/defaults');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = withNxMetro(defaultConfig, {
    transformer: {
        babelTransformerPath: require.resolve('./customTransformer'),
    },
    resolver: {
        sourceExts: [...sourceExts, 'svg'],
        assetExts: assetExts.filter((ext: string) => ext !== 'svg'),
    },
    // Change this to true to see debugging info.
    // Useful if you have issues resolving modules
    debug: false,
    // all the file extensions used for imports other than 'ts', 'tsx', 'js', 'jsx', 'json'
    extensions: [],
    // Specify folders to watch, in addition to Nx defaults (workspace libraries and node_modules)
    watchFolders: []
});
