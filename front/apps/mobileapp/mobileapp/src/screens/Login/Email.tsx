import React from 'react'

import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';

import {
  Header,
  SubHeader2,
  TextInput,
  Button,
  Seperator,
  Box
} from '@components';
import {
  FacebookLogo,
  GoogleLogo,
} from '@ledget/media/native';
import { EmailProps } from '@types';
import { LogoIcon } from '@ledget/media/native';
import Legal from './Legal';


import styles from './styles/email'

const schema = z.object({
  email: z.string()
    .min(1, { message: 'required' })
    .email({ message: 'Invalid email' })
    .transform(value => value.trim())
});

export default function Login({ navigation, route }: EmailProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    navigation.navigate('Aal2Authenticator', { identifier: data.email });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box variant='fullCentered'>
        <View style={styles.logoContainer}>
          <LogoIcon />
        </View>
        <Header style={styles.header}>Welcome Back</Header>
        <SubHeader2 style={styles.header}>Please login to continue</SubHeader2>
        <View style={styles.form}>
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
                returnKeyType='go'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email}
              />
            )}
            name="email"
          />
          <Button
            label="Next"
            variant="main"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
        <Legal />
        <View style={styles.socialForm}>
          <Seperator label='Or Sign In With' variant='l' />
          <View style={styles.socialButtons}>
            <Button variant='socialSignIn' onPress={() => { }}>
              <FacebookLogo />
            </Button>
            <Button variant='socialSignIn' onPress={() => { }}>
              <GoogleLogo />
            </Button>
          </View>
        </View>
      </Box>
    </TouchableWithoutFeedback>
  )
}
