import React from 'react'

import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';

import {
  Box,
  Header,
  SubHeader2,
  TextInput,
  Button,
  Seperator
} from '@components';
import {
  FacebookLogo,
  GoogleLogo,
} from '@ledget/media/native';
import { EmailProps } from '@types';
import Legal from './Legal';
import Logo from './Logo';

import styles from './styles/email'

const schema = z.object({ email: z.string().email() });

export default function Login({ navigation, route }: EmailProps) {
  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box style={styles.emailScreen}>
        <Logo />
        <Header>Welcome Back</Header>
        <SubHeader2>Please login to continue</SubHeader2>
        <Box style={styles.form}>
          <Controller
            control={control}
            rules={{ required: 'This is a required field' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label='Email'
                placeholder='Email'
                keyboardType='email-address'
                textContentType='emailAddress'
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='next'
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="email"
            defaultValue=""
          />
          <Button
            label="Next"
            variant="main"
            onPress={() => {
              handleSubmit((data) => {
                navigation.navigate(
                  'Aal1Authentication',
                  { identifier: data.email })
              })
            }}
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
    </TouchableWithoutFeedback>
  )
}
