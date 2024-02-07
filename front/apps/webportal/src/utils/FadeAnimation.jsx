import React from 'react'
import { motion } from 'framer-motion'

const FadeAnimation = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                opacity: { duration: .1, ease: "easeOut" }
            }}
        >
            {children}
        </motion.div >
    )
}

export default FadeAnimation
