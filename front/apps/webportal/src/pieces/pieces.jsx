import React from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { Alert2 } from '@ledget/shared-assets'
import "./pieces.css"

export const FormErrorTip = ({ error }) => {

    return (
        <>
            {
                error?.type === 'required' &&
                <div className='error-tip'>
                    <Alert2 />
                </div>
            }
        </>
    )
}

export const LoadingRing = () => {
    return (
        <>
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </>
    )
}

export const FormError = (props) => {
    const renderLines = (text) => {
        const lines = text.split('\n')
        return lines.map((line, index) => <React.Fragment key={index}>{line}<br /></React.Fragment>)
    }

    return (
        <>
            {props.msg &&
                <div className="error-container">
                    <div className="form-error">
                        <Alert2 />
                        {renderLines(props.msg)}
                    </div>
                </div>
            }
        </>
    )
}

export const WindowLoadingBar = ({ visible }) => {


    return (
        <AnimatePresence initial={false}>
            {visible &&
                <motion.div
                    className="loading-bar-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: visible ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                >
                    <div className="loading-bar">
                        <div className="loading-bar-edges"></div>
                        <div className="loading-bar-shimmer"></div>
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    )
}
