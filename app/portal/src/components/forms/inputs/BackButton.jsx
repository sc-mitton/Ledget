import React from 'react'

import BackArrow from '../../../assets/icons/BackArrow'
import './styles/BackButton.css'

const BackButton = ({ onClick, props }) => {
  return (
    <button
      className="back-button"
      onClick={(e) => onClick(e)}
      {...props}
    >
      <BackArrow />
      back
    </button>
  )
}

export default BackButton
