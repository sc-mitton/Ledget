import React, { useEffect } from 'react';

import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '@shopify/restyle';

import styles from './styles/shared';
import { useNativeFlow } from '@ledget/ory';
import { useLazyGetLoginFlowQuery, useCompleteLoginFlowMutation } from '@/features/orySlice';
import { Header, NestedScreenWOFeedback, SubHeader2, TextInput, Button, Pulse, JiggleView } from '@ledget/native-ui';
import { useGetMeQuery } from '@ledget/shared-features';
import { RecoveryCode } from '@ledget/media/native';
import { Aal2RecoveryCodeScreenProps } from '@types';

const schema = z.object({
  lookup_secret: z.string().min(1, 'Recovery code is required'),
});

const Aal2RecoveryCode = ({ navigation, route }: Aal2RecoveryCodeScreenProps) => {
  const theme = useTheme();
  const { data: user } = useGetMeQuery()
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { fetchFlow, submitFlow, flowStatus } = useNativeFlow(
    useLazyGetLoginFlowQuery,
    useCompleteLoginFlowMutation,
    'login'
  );

  useEffect(() => fetchFlow({ aal: 'aal2' }), []);

  // Navigate to verification if user is not verified
  useEffect(() => {
    if (user && !user.is_verified) {
      navigation.navigate('Verification', {
        identifier: route.params.identifier
      });
    }
  }, [user]);

  const onSubmit = (data: z.infer<typeof schema>) => {
    submitFlow({
      ...data,
      method: 'lookup_secret',
      identifier: route.params.identifier,
    })
  }

  return (
    <NestedScreenWOFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Header>Recovery Code</Header>
        <SubHeader2>Enter one of your saved recovery codes to login</SubHeader2>
        <View style={styles.graphicContainer}>
          <RecoveryCode fill={theme.colors.mainBackground} stroke={theme.colors.grayIcon} />
          <Pulse success={flowStatus.isCompleteSuccess} />
        </View>
        <JiggleView style={styles.centeredForm} jiggle={flowStatus.isCompleteError}>
          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <TextInput
                label="Code"
                placeholder="Enter your recovery code"
                onChangeText={onChange}
                error={errors.lookup_secret}
              />
            )}
            name="lookup_secret"
            defaultValue=""
          />
          <Button
            variant='main'
            label="Submit"
            onPress={handleSubmit(onSubmit)}
          />
        </JiggleView>
      </KeyboardAvoidingView>
    </NestedScreenWOFeedback>
  )
}

export default Aal2RecoveryCode
