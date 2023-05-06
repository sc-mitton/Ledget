import React from 'react'

import "./Widgets.css"

export const LoadingRing = ({ height }) => {
    return (
        <>
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </>
    )
}
