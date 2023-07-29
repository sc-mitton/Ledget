import React, { useState } from 'react'

import { motion } from 'framer-motion'
import Replay from "@assets/icons/Replay"
import './styles/ResendButton.css'

const ResendButton = () => {
    const [rotation, setRotation] = useState(0)

    return (
        <div id="resend-btn-container">
            <motion.button
                id="resend-btn"
                type="submit"
                value="code"
                onClick={() => setRotation(rotation - 360)}
                aria-label="Resend email"
                name="resend"
            >
                <span>Resend</span>
                <motion.div
                    animate={{
                        rotate: rotation,
                        transition: { duration: .5, type: 'spring', stiffness: 200, damping: 16 },
                    }}
                    id="resend-icon"
                >
                    <Replay fill={'var(--main-green)'} />
                </motion.div>
            </motion.button>
        </div>
    )
}

export default ResendButton
