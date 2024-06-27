import React from 'react'

import {
  Box,
  Header,
  SubHeader2,
  TextInput,
  Button,
  Seperator
} from '@components'
import {
  FacebookLogo,
  GoogleLogo
} from '@ledget/media/native'
import Legal from './Legal'

import styles from './styles/login'

export default function Login() {
  return (
    <Box style={styles.loginScreen}>
      <Header>Welcome Back</Header>
      <SubHeader2>Please login to continue</SubHeader2>
      <Box style={styles.form}>
        <TextInput
          label='Email'
          placeholder='Enter your email...'
          keyboardType='email-address'
          textContentType='emailAddress'
          autoCapitalize='none'
          autoCorrect={false}
          returnKeyType='next'
          onSubmitEditing={() => { }}
        />
        <Button
          label="Next"
          variant="main"
          onPress={() => { }}
        />
      </Box>
      <Legal />
      <Box style={styles.socialForm}>
        <Seperator label='Or Sign In With' variant='l' />
        <Box style={styles.socialButtons}>
          <Button variant='socialSignIn' onPress={() => { }}>
            <FacebookLogo />
          </Button>
          <Button variant='socialSignIn' onPress={() => { }}>
            <GoogleLogo />
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
