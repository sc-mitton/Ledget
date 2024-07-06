import React, { useEffect } from 'react'

import { KeyboardAvoidingView, View, Platform } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';
import { useTheme } from '@shopify/restyle';
import { Mail } from 'geist-icons-native';

import styles from './styles';
import { Header, SubHeader2, Otc, Button, Pulse, NestedScreenWOFeedback, Icon } from '@components'
import { VerificationScreenProps } from '@types'
import { useNativeFlow } from '@ledget/ory'
import { useLazyGetLoginFlowQuery, useCompleteLoginFlowMutation } from '@features/orySlice';

const schema = z.object({
  code: z.string().length(6, { message: 'Invalid code' })
})

const Verification = ({ navigation, route }: VerificationScreenProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  const { flow, fetchFlow, completeFlow, flowStatus } = useNativeFlow(
    useLazyGetLoginFlowQuery,
    useCompleteLoginFlowMutation,
    'login'
  )

  useEffect(() => fetchFlow({ aal: 'aal1' }), [])
  const theme = useTheme()

  const onSubmit = (data: z.infer<typeof schema>) => {
    completeFlow({
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
          <Header>Verification</Header>
          <SubHeader2>To verify your account, please enter the code sent to your email</SubHeader2>
        </View>
        <View style={styles.graphicContainer}>
          <Icon icon={Mail} color={flowStatus.isCompleteSuccess ? 'successIcon' : 'grayIcon'} size={54} />
          <Pulse success={flowStatus.isCompleteSuccess} />
        </View>
        <View style={styles.form}>
          <Controller
            control={control}
            name='code'
            render={({ field: { onChange } }) => (
              <Otc
                autoFocus
                codeLength={6}
                onCodeChange={onChange}
                error={errors.code?.message}
              />
            )}
          />
          <Button
            label='Submit'
            variant='main'
            onPress={handleSubmit(onSubmit)}
          />
          <Button
            label='Resend'
            variant='borderedGrayMain'
            onPress={() => console.log('Resend')}
          />
        </View>
      </KeyboardAvoidingView>
    </NestedScreenWOFeedback>
  )
}

export default Verification
