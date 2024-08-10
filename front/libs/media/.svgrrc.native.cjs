module.exports = {
    ext: 'tsx',
    prettierConfig: {
        parser: 'typescript'
    },
    native: true,
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
                        elements: ['Svg', 'Path'],
                        attributes: [
                            'xmlns',
                            'className',
                            'id',
                            'xmlSpace',
                            'data-name',
                            'fill',
                            'stroke'
                        ]
                    },
                ],
                [
                    '@svgr/babel-plugin-replace-jsx-attribute-value',
                    {
                        values: [
                            { value: '#292929', newValue: 'currentColor' },
                            { value: '#000', newValue: 'currentColor' }
                        ]
                    }
                ]
            ]
        }
    }
};
