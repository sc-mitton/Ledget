import React, { useEffect, useState } from 'react'

import { KeyboardAvoidingView, View, Platform } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';
import { Mail } from 'geist-native-icons';

import styles from './styles';
import { Header, SubHeader2, Otc, SubmitButton, Pulse, NestedScreenWOFeedback, Icon, JiggleView, FormError } from '@ledget/native-ui'
import { VerificationScreenProps } from '@types'
import { useNativeFlow, useVerificationCodeHandler } from '@ledget/ory'
import { useLazyGetVerificationFlowQuery, useCompleteVerificationFlowMutation } from '@features/orySlice';
import { useCheckFlowProgress } from '@/hooks/useCheckFlowProgress';

const schema = z.object({
  code: z.string().length(6, { message: 'Invalid code' })
})

const Verification = ({ navigation, route }: VerificationScreenProps) => {
  const [isResending, setIsResending] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });
  const { fetchFlow, submitFlow, flowStatus: { isCompleteSuccess, isCompletingFlow }, result } = useNativeFlow(
    useLazyGetVerificationFlowQuery,
    useCompleteVerificationFlowMutation,
    'verification'
  )
  const { jiggle, unhandledIdMessage, refreshSuccess, codeIsCorrect } = useVerificationCodeHandler({
    dependencies: [isCompleteSuccess],
    onExpired: () => console.log('Expired'),
    onSuccess: () => console.log('Success'),
    result
  })

  useCheckFlowProgress({ navigation, route, invalidates: [codeIsCorrect] })

  useEffect(() => fetchFlow(), [])

  // Lower resending state when flow is resent
  useEffect(() => {
    if (isCompleteSuccess) {
      setIsResending(false)
    }
  }, [isCompleteSuccess])

  const onSubmit = (data: z.infer<typeof schema>) => {
    submitFlow({ ...data, method: 'code' })
  }

  const onResendSubmit = () => {
    setIsResending(true)
    submitFlow({ email: route.params.identifier, method: 'code' })
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
          <Icon icon={Mail} color={isCompleteSuccess ? 'successIcon' : 'grayIcon'} size={54} />
          <Pulse success={isCompleteSuccess} />
        </View>
        <JiggleView style={styles.form} jiggle={jiggle}>
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
          {unhandledIdMessage && <FormError error={unhandledIdMessage} />}
          <SubmitButton
            label='Submit'
            variant='main'
            onPress={handleSubmit(onSubmit)}
            isSubmitting={isCompletingFlow && !isResending}
          />
          <SubmitButton
            label='Resend'
            variant='borderedGrayMain'
            onPress={onResendSubmit}
            isSuccess={refreshSuccess}
            isSubmitting={isCompletingFlow && isResending}
          />
        </JiggleView>
      </KeyboardAvoidingView>
    </NestedScreenWOFeedback>
  )
}

export default Verification
