import React, { useEffect } from 'react'

import { KeyboardAvoidingView, View, Platform } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';
import { useTheme } from '@shopify/restyle';

import sharedStyles from './styles/shared';
import { Header, SubHeader2, Otc, Button, Pulse, NestedScreenWOFeedback, JiggleView } from '@components'
import { Aal2AuthenticatorScreenProps } from '@types'
import { useNativeFlow } from '@ledget/ory'
import { Authenticator } from '@ledget/media/native';
import { useLazyGetLoginFlowQuery, useCompleteLoginFlowMutation } from '@features/orySlice';

const schema = z.object({
  totp: z.string().length(6, { message: 'Invalid code' })
})

const Aal1Authentication = ({ navigation, route }: Aal2AuthenticatorScreenProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  const { fetchFlow, submitFlow, flowStatus } = useNativeFlow(
    useLazyGetLoginFlowQuery,
    useCompleteLoginFlowMutation,
    'login'
  )

  useEffect(() => fetchFlow({ aal: 'aal1' }), [])
  const theme = useTheme()

  const onSubmit = (data: z.infer<typeof schema>) => {
    submitFlow({
      ...data,
      identifier: route.params.identifier,
      method: 'password'
    })
  }

  return (
    <NestedScreenWOFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View>
          <Header>One Time Code</Header>
          <SubHeader2>Enter the code from your authenticator app or use a saved recovery code</SubHeader2>
        </View>
        <View style={sharedStyles.graphicContainer}>
          <Authenticator
            fill={theme.colors.mainBackground}
            stroke={flowStatus.isCompleteSuccess ? theme.colors.successIcon : theme.colors.grayIcon}
          />
          <Pulse success={flowStatus.isCompleteSuccess} />
        </View>
        <JiggleView style={sharedStyles.form} jiggle={flowStatus.isCompleteError}>
          <Controller
            control={control}
            name='totp'
            render={({ field: { onChange } }) => (
              <Otc
                autoFocus
                codeLength={6}
                onCodeChange={onChange}
                error={errors.totp?.message}
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
            onPress={() => navigation.navigate('Aal2RecoveryCode', { identifier: route.params.identifier })}
          />
        </JiggleView>
      </KeyboardAvoidingView>
    </NestedScreenWOFeedback>
  )
}

export default Aal1Authentication
