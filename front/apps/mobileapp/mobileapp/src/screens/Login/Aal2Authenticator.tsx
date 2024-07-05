import React, { useEffect } from 'react'

import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, View, Platform } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';

import sharedStyles from './styles/shared';
import { Box, Header, SubHeader2, Otc, Button, Pulse } from '@components'
import { Envelope } from '@ledget/media/native';
import { Aal2AuthenticationProps } from '@types'
import { useNativeFlow } from '@ledget/ory'
import { useLazyGetLoginFlowQuery, useCompleteLoginFlowMutation } from '@features/orySlice';
import { useAppearance } from '@theme'

const schema = z.object({
  otc: z.string().length(6, { message: 'Invalid code' })
})

const Aal1Authentication = ({ navigation, route }: Aal2AuthenticationProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  const { flow, fetchFlow, completeFlow, flowStatus } = useNativeFlow(
    useLazyGetLoginFlowQuery,
    useCompleteLoginFlowMutation,
    'login'
  )
  const { mode } = useAppearance()

  useEffect(() => fetchFlow({ aal: 'aal1' }), [])

  const onSubmit = (data: z.infer<typeof schema>) => {
    completeFlow({
      ...data,
      identifier: route.params.identifier,
      method: 'password'
    })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box variant='screenWithHeader'>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View>
            <Header>One Time Code</Header>
            <SubHeader2>Enter the code from your Envelope app or use a saved recovery code</SubHeader2>
          </View>
          <View style={sharedStyles.graphicContainer}>
            <Envelope dark={mode === 'dark'} />
            <Pulse success={flowStatus.isCompleteSuccess} />
          </View>
          <View style={sharedStyles.form}>
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
              onPress={() => navigation.navigate('Aal2RecoveryCode', { identifier: route.params.identifier })}
            />
          </View>
        </KeyboardAvoidingView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default Aal1Authentication
