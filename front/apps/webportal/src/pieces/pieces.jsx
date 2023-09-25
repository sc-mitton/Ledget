import React from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import "./pieces.css"

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


