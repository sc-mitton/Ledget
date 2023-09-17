import React from 'react'

import { motion } from 'framer-motion'

import { formatCurrency } from '@ledget/shared-utils'

export const DollarCents = ({ value, ...props }) => {
    const str = formatCurrency(value)

    return (
        <div style={{ textAlign: 'end' }}>
            <span>
                {`${str.split('.')[0]}`}
            </span>
            <span style={{ fontSize: '.7em' }}>
                {`.${str.split('.')[1]}`}
            </span>
        </div>
    )
}

export const DollarCentsRange = ({ lower, upper }) => {

    return (
        <>
            {lower && <DollarCents value={lower} />}
            {lower && <span>&nbsp;&nbsp;&ndash;&nbsp;&nbsp;</span>}
            <DollarCents value={upper} />
        </>
    )
}

export const ZoomMotionDiv = ({ children, ...rest }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        {...rest}
    >
        {children}
    </motion.div>
)

export const SlideMotionDiv = ({ children, first, last, ...rest }) => (
    <motion.div

        initial={{
            opacity: first ? 1 : 0,
            x: first ? 0 : 50
        }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: last ? 50 : -50 }}
        transition={{ duration: 0.15 }}
        {...rest}
    >
        {children}
    </motion.div>
)
