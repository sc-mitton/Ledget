module.exports = {
  ext: 'tsx',
  prettierConfig: {
    parser: 'typescript',
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
    fill: 'currentColor',
  },
  jsx: {
    babelConfig: {
      plugins: [
        [
          '@svgr/babel-plugin-remove-jsx-attribute',
          {
            elements: ['svg', 'path'],
            attributes: ['xmlns', 'className', 'id', 'xmlSpace', 'data-name'],
          },
        ],
        [
          '@svgr/babel-plugin-replace-jsx-attribute-value',
          {
            values: [
              { value: '#292929', newValue: 'currentColor' },
              { value: '#000', newValue: 'currentColor' },
            ],
          },
        ],
      ],
    },
  },
};
