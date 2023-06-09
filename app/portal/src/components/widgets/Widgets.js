import React from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import alert2 from '../../assets/icons/alert2.svg'
import "./widgets.css"

export const FormErrorTip = (props) => {
    return (
        <div className='error-tip'>
            <img
                src={alert2}
                className="error-tip-icon"
                alt="Error"
            />
            {props.msg && <span className="error-tip-msg">{props.msg}</span>}
        </div>
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
    return (
        <div className="error-container">
            <div className="form-error">
                <img src={alert2} className="error-icon" />
                {props.msg}
            </div>
        </div>
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
                    <div className="loading-bar-edges"></div>
                    <div className="loading-bar-shimmer"></div>
                </motion.div>
            }
        </AnimatePresence>
    )
}
