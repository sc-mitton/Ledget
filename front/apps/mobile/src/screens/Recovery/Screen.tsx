import React, { useEffect, useRef } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '@shopify/restyle';
import LottieView from 'lottie-react-native';

import styles from './styles';
import { useNativeFlow } from '@ledget/ory';
import {
  useLazyGetRecoveryFlowQuery,
  useCompleteRecoveryFlowMutation,
} from '@features/orySlice';
import {
  Header,
  NestedScreenWOFeedback,
  SubHeader2,
  Button,
  Otc,
  Box,
  Icon,
} from '@ledget/native-ui';
import { RecoveryScreenProps } from '@types';
import { useFlowProgress } from '@hooks';

const schema = z.object({
  code: z.string().length(6, { message: 'Invalid code' }),
});

export default function Recovery({ navigation, route }: RecoveryScreenProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const {
    flowId,
    fetchFlow,
    submitFlow,
    flowStatus: { isCompleteSuccess, isGetFlowSuccess },
    result,
  } = useNativeFlow(
    useLazyGetRecoveryFlowQuery,
    useCompleteRecoveryFlowMutation,
    'recovery'
  );
  const theme = useTheme();
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    fetchFlow();
  }, []);

  useFlowProgress({
    navigation,
    route,
    updateProgress: isCompleteSuccess && hasSubmitted,
    token: result?.session_token,
    id: result?.session?.id,
  });

  useEffect(() => {
    if (isGetFlowSuccess && flowId) {
      submitFlow({ method: 'code', email: route.params.identifier });
    }
  }, [isGetFlowSuccess, flowId]);

  useEffect(() => {
    if (isCompleteSuccess && hasSubmitted) {
      animation.current?.play();
    }
  }, [isCompleteSuccess, hasSubmitted]);

  const onSubmit = (data: z.infer<typeof schema>) => {
    submitFlow({ ...data, method: 'code' });
    setTimeout(() => setHasSubmitted(true), 500);
  };

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
            <LottieView
              style={{ width: 54, height: 54 }}
              colorFilters={[
                {
                  keypath: 'lock',
                  color:
                    isCompleteSuccess && hasSubmitted
                      ? theme.colors.success.successIcon
                      : theme.colors.secondaryText,
                },
              ]}
              loop={false}
              ref={animation}
              source={require('../../../assets/lotties/lock.json')}
            />
          </View>
        </View>
        <Box style={styles.form}>
          <Controller
            control={control}
            name="code"
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
            label="Submit"
            variant="main"
            onPress={handleSubmit(onSubmit)}
          />
          <Button
            label="Use Recovery Code"
            variant="borderedGrayMain"
            onPress={() =>
              navigation.navigate('Login', {
                screen: 'Aal2RecoveryCode',
                params: { identifier: route.params.identifier },
              })
            }
          />
        </Box>
      </KeyboardAvoidingView>
    </NestedScreenWOFeedback>
  );
}
