import React from 'react'
import Color from 'color';

function getContrastColor(bgColor) {
    const color = Color(bgColor);
    const whiteContrast = color.contrast(Color('white'));
    const blackContrast = color.contrast(Color('black'));

    return whiteContrast > blackContrast ? 'white' : 'black';
}

const Base64Image = (props) => {
    const { data, backgroundColor, alt, style, ...rest } = props

    const config = {
        padding: '2px 2px',
        backgroundColor: backgroundColor,
        borderRadius: 'var(--border-radius4)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: getContrastColor(backgroundColor),
        ...style
    }

    return (
        <div
            style={config}
            {...rest}
        >
            <img
                style={{
                    height: '1.2em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                src={`data:image/png;base64,${data}`}
                alt={alt}
            />
        </div>
    )
}

export default Base64Image
