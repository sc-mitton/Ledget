module.exports = {
    ext: 'tsx',
    prettierConfig: {
        parser: 'typescript',
    },
    native: true,
    icon: true,
    typescript: true,
    svgProps: {
        width: "{size}",
        height: "{size}",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 1.5,
        stroke: 'currentColor',
        fill: 'none',
    },
    jsx: {
        babelConfig: {
            plugins: [
                // xmlns is not typed correctly
                [
                    '@svgr/babel-plugin-remove-jsx-attribute',
                    {
                        elements: ['Svg', 'Path'],
                        attributes: ['xmlns', 'xmlSpace', 'style', 'stroke', 'fill'],
                    }
                ],
                [
                    '@svgr/babel-plugin-replace-jsx-attribute-value',
                    {
                        "values": [
                            { "value": "#292929", "newValue": "currentColor" }
                        ]
                    }
                ]
            ],
        },
    },
}
