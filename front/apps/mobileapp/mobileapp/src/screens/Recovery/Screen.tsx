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
import { useStoreToken, useFlowProgress } from '@hooks';

const schema = z.object({
  code: z.string().length(6, { message: 'Invalid code' })
})

export default function Recovery({ navigation, route }: RecoveryScreenProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });
  const { fetchFlow, submitFlow, flowStatus: { isCompleteSuccess }, result } = useNativeFlow(
    useLazyGetRecoveryFlowQuery,
    useCompleteRecoveryFlowMutation,
    'recovery'
  )

  useStoreToken({ token: result?.session_token, id: result?.session.id });

  useEffect(() => { fetchFlow() }, [])

  useFlowProgress({ navigation, route, updateProgress: isCompleteSuccess });

  const onSubmit = (data: z.infer<typeof schema>) => {
    submitFlow({ ...data, email: route.params.identifier, method: 'code' });
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
          <View style={styles.icon} >
            <Icon
              icon={Mail}
              color={isCompleteSuccess ? 'successIcon' : 'grayIcon'}
              size={54}
            />
          </View>
          <View style={styles.iconBackgroundContainer}>
            <Icon
              icon={Mail}
              borderColor={'mainBackground'}
              size={54}
            />
          </View>
          <Pulse success={false} />
        </View>
        <View style={styles.form}>
          <Controller
            control={control}
            name='code'
            render={({ field: { onChange, value } }) => (
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
