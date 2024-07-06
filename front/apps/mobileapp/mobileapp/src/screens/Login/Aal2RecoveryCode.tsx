import React from 'react'

import { KeyboardAvoidingView, Platform } from 'react-native'

import { Header, NestedScreenWOFeedback, SubHeader2 } from '@components'



const Aal2RecoveryCode = () => {
  return (
    <NestedScreenWOFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Header>Recovery Code</Header>
        <SubHeader2>Enter one of your saved recovery codes to login</SubHeader2>
      </KeyboardAvoidingView>
    </NestedScreenWOFeedback>
  )
}

export default Aal2RecoveryCode
