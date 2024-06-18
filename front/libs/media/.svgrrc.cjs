module.exports = {
  ext: 'tsx',
  prettierConfig: {
    parser: 'typescript'
  },
  icon: true,
  typescript: true,
  svgProps: {
    width: '{size}',
    height: '{size}',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.5,
    stroke: 'currentColor',
    fill: 'none'
  },
  jsx: {
    babelConfig: {
      plugins: [
        [
          '@svgr/babel-plugin-remove-jsx-attribute',
          {
            elements: ['svg', 'path'],
            attributes: [
              'xmlns',
              'className',
              'id',
              'xmlSpace',
              'style',
              'stroke',
              'fill'
            ]
          }
        ],
        [
          '@svgr/babel-plugin-replace-jsx-attribute-value',
          {
            values: [{ value: '#292929', newValue: 'currentColor' }]
          }
        ]
      ]
    }
  }
};
