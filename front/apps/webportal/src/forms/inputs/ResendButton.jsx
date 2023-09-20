import React, { useState } from 'react'

import { motion } from 'framer-motion'
import { Replay } from "@ledget/shared-assets"
import './styles/ResendButton.css'

const ResendButton = (props) => {
    const [rotation, setRotation] = useState(0)

    return (
        <div id="resend-btn-container">
            <motion.button
                className="btn-secondary"
                id="resend-btn"
                onClick={() => setRotation(rotation + 360)}
                {...props}
            >
                <span>Resend</span>
                <motion.div
                    animate={{
                        rotate: rotation,
                        transition: { duration: .5, type: 'spring', stiffness: 200, damping: 16 },
                    }}
                    id="resend-icon"
                >
                    <Replay fill={'var(--m-green-hover)'} />
                </motion.div>
            </motion.button>
        </div>
    )
}

export default ResendButton
