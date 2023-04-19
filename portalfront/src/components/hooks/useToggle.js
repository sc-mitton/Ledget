import { useState } from 'react'
import React from 'react'

function useToggle(initialState = false) {
    const [state, setState] = useState(initialState)
    const toggle = () => setState(!state)
    return [state, toggle]
}

export default useToggle
