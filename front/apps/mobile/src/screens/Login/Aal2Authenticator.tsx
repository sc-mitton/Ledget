import React, { useEffect } from 'react'

import { KeyboardAvoidingView, View, Platform } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';
import { useTheme } from '@shopify/restyle';

import sharedStyles from './styles/shared';
import { Header, SubHeader2, Otc, Button, Pulse, NestedScreenWOFeedback, JiggleView } from '@ledget/native-ui'
import { LoginScreenProps } from '@types'
import { useNativeFlow } from '@ledget/ory'
import { Authenticator } from '@ledget/media/native';
import { useLazyGetLoginFlowQuery, useCompleteLoginFlowMutation } from '@features/orySlice';
import { useFlowProgress } from '@hooks';

const schema = z.object({
  totp: z.string().length(6, { message: 'Invalid code' })
})

const Aal2Authenticator = ({ navigation, route }: LoginScreenProps<'Aal2Authenticator'>) => {
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  const { fetchFlow, submitFlow, flowStatus: { isCompleteSuccess, isCompleteError }, result } = useNativeFlow(
    useLazyGetLoginFlowQuery,
    useCompleteLoginFlowMutation,
    'login'
  )
  useFlowProgress({
    navigation,
    route,
    updateProgress: isCompleteSuccess,
    token: result?.session_token,
    id: result?.session.id
  });

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
        <View style={sharedStyles.header}>
          <Header variant='geistBold'>One Time Code</Header>
          <SubHeader2>Enter the code from your authenticator app or use a saved recovery code</SubHeader2>
        </View>
        <View style={sharedStyles.graphicContainer}>
          <Authenticator
            fill={theme.colors.accountsMainBackground}
            stroke={isCompleteSuccess ? theme.colors.successIcon : theme.colors.secondaryText}
          />
        </View>
        <JiggleView style={sharedStyles.form} jiggle={isCompleteError}>
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

export default Aal2Authenticator
