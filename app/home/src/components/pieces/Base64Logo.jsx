import React from 'react'

const Base64Image = (props) => {
    const { data, color, alt, style, ...rest } = props

    return (
        <div
            style={{
                padding: '2px 12px',
                backgroundColor: color,
                borderRadius: 'var(--border-radius2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...style
            }}
            {...rest}
        >
            <img
                style={{
                    height: '1.2em'
                }}
                src={`data:image/png;base64,${data}`}
                alt={alt}
            />
        </div>
    )
}

export default Base64Image
