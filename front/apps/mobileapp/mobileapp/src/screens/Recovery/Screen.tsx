import React, { useEffect } from 'react'
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'geist-native-icons';
import { z } from 'zod';

import styles from './styles';
import { useNativeFlow } from '@ledget/ory';
import { useLazyGetRecoveryFlowQuery, useCompleteRecoveryFlowMutation } from '@features/orySlice'
import { Header, NestedScreenWOFeedback, SubHeader2, Button, Pulse, Otc, Icon } from '@ledget/native-ui'
import { RecoveryScreenProps } from '@types'
import { apiSlice } from '@ledget/shared-features';
import { useStoreToken, useCheckFlowProgress } from '@hooks';

const schema = z.object({
  otc: z.string().length(6, { message: 'Invalid code' })
})

export default function Recovery({ navigation, route }: RecoveryScreenProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });
  const { fetchFlow, flowStatus: { isCompleteSuccess }, result } = useNativeFlow(
    useLazyGetRecoveryFlowQuery,
    useCompleteRecoveryFlowMutation,
    'recovery'
  )

  useStoreToken(result?.session_token)

  useEffect(() => {
    if (isCompleteSuccess) {
      apiSlice.util.invalidateTags(['User']);
    }
  }, [isCompleteSuccess])

  useEffect(() => { fetchFlow() }, [])

  useCheckFlowProgress({ navigation, route, isComplete: isCompleteSuccess });

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
          <Icon icon={Mail} color={isCompleteSuccess ? 'successIcon' : 'grayIcon'} size={54} />
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
