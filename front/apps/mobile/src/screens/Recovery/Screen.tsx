import React, { useEffect } from 'react'
import { View, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';
import { Lock, Unlock } from 'geist-native-icons';

import styles from './styles';
import { useNativeFlow } from '@ledget/ory';
import { useLazyGetRecoveryFlowQuery, useCompleteRecoveryFlowMutation } from '@features/orySlice'
import { Header, NestedScreenWOFeedback, SubHeader2, Button, Pulse, Otc, Box, Icon } from '@ledget/native-ui'
import { RecoveryScreenProps } from '@types'
import { useFlowProgress } from '@hooks';
import { useAppearance } from '@/features/appearanceSlice';

const schema = z.object({
  code: z.string().length(6, { message: 'Invalid code' })
})

export default function Recovery({ navigation, route }: RecoveryScreenProps) {
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });
  const { fetchFlow, submitFlow, flowStatus: { isCompleteSuccess }, result } = useNativeFlow(
    useLazyGetRecoveryFlowQuery,
    useCompleteRecoveryFlowMutation,
    'recovery'
  )

  useEffect(() => { fetchFlow() }, [])

  // Add a listener to the keyboard
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useFlowProgress({
    navigation,
    route,
    updateProgress: isCompleteSuccess,
    token: result?.session_token,
    id: result?.session.id
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    submitFlow({ ...data, email: route.params.identifier, method: 'code' });
  }

  return (
    <NestedScreenWOFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.screen}
      >
        <View style={styles.header}>
          <Header>Recover Account</Header>
          <SubHeader2>Enter the code sent to your email</SubHeader2>
        </View>
        <View style={styles.graphicContainer}>
          <View style={styles.icon}>
            <Icon
              icon={isCompleteSuccess ? Unlock : Lock}
              size={keyboardVisible ? 48 : 54}
              strokeWidth={1.25}
              color={isCompleteSuccess ? 'successIcon' : 'tertiaryText'}
            />
            <Box style={styles.iconBackgroundContainer} backgroundColor='mainBackground' />
          </View>
          <Pulse success={isCompleteSuccess} size={keyboardVisible ? 'm' : 'l'} />
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
