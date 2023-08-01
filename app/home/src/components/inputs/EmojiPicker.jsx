import React from 'react'

import InputEmoji from "react-input-emoji";


const EmojiPicker = ({ value, onChange }) => {
    return (
        <div className="emoji-picker">
            <InputEmoji
                value={value}
                onChange={onChange}
                cleanOnEnter
                placeholder="Type a message"
                height={40}
                borderRadius={40}
            />
        </div>
    )
}

export default EmojiPicker
