import React from 'react'
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';

import styles from './styles';
import { Header, NestedScreenWOFeedback, SubHeader2, Button, Pulse, Otc } from '@components'
import { Key } from '@ledget/media/native';
import { useAppearance } from '@theme';
import { RecoveryScreenProps } from '@types'

const schema = z.object({
  otc: z.string().length(6, { message: 'Invalid code' })
})

export default function Login({ navigation, route }: RecoveryScreenProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });
  const appearance = useAppearance()

  const theme = useTheme()

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(data)
  }

  return (
    <NestedScreenWOFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Header>Recover Account</Header>
        <SubHeader2>Enter the code sent to your email</SubHeader2>
        <View style={styles.graphicContainer}>
          <Key
            fill={appearance.mode === 'light' ? theme.colors.grayIcon : theme.colors.mainBackground}
            stroke={theme.colors.grayIcon}
          />
          <Pulse success={false} />
        </View>
        <View style={styles.form}>
          <Controller
            control={control}
            name='otc'
            render={({ field: { onChange, value } }) => (
              <Otc
                autoFocus
                codeLength={6}
                onCodeChange={onChange}
                error={errors.otc?.message}
              />
            )}
          />
          <Button
            label='Submit'
            variant='main'
            onPress={handleSubmit(onSubmit)}
          />
          <Button
            label='Use Recovery Code'
            variant='borderedGrayMain'
            onPress={() => navigation.navigate(
              'Login',
              { screen: 'Aal2RecoveryCode', params: { identifier: route.params.identifier } })}
          />
        </View>
      </KeyboardAvoidingView>
    </NestedScreenWOFeedback>
  )
}
