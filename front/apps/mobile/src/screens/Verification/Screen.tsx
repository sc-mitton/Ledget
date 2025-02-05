import { useEffect, useRef, useState } from 'react';

import { KeyboardAvoidingView, View, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '@shopify/restyle';
import LottieView from 'lottie-react-native';

import styles from './styles';
import {
  Header,
  SubHeader2,
  Otc,
  SubmitButton,
  NestedScreenWOFeedback,
  JiggleView,
  FormError,
} from '@ledget/native-ui';
import { VerificationScreenProps } from '@types';
import { useNativeFlow, useVerificationCodeHandler } from '@ledget/ory';
import {
  useLazyGetVerificationFlowQuery,
  useCompleteVerificationFlowMutation,
} from '@features/orySlice';
import { useFlowProgress } from '@/hooks/useFlowProgress';
import { mail } from '@ledget/media/lotties';

const schema = z.object({
  code: z.string().length(6, { message: 'Invalid code' }),
});

const Verification = ({ navigation, route }: VerificationScreenProps) => {
  const theme = useTheme();
  const [isResending, setIsResending] = useState(false);
  const animation = useRef<LottieView>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });
  const {
    fetchFlow,
    submitFlow,
    flowStatus: { isCompleteSuccess, isCompletingFlow },
    result,
  } = useNativeFlow(
    useLazyGetVerificationFlowQuery,
    useCompleteVerificationFlowMutation,
    'verification'
  );
  const { jiggle, unhandledIdMessage, refreshSuccess, codeIsCorrect } =
    useVerificationCodeHandler({
      dependencies: [isCompleteSuccess],
      onExpired: () => console.log('Expired'),
      onSuccess: () => console.log('Success'),
      result,
    });

  useFlowProgress({ navigation, route, updateProgress: isCompleteSuccess });

  useEffect(() => fetchFlow(), []);

  // Lower resending state when flow is resent
  useEffect(() => {
    if (isCompleteSuccess) {
      setIsResending(false);
    }
  }, [isCompleteSuccess]);

  useEffect(() => {
    animation.current?.reset();
    animation.current?.play();
    setTimeout(() => {
      animation.current?.play(25, 0);
    }, 2000);
    const i = setInterval(() => {
      animation.current?.reset();
      animation.current?.play();
      setTimeout(() => {
        animation.current?.play(25, 0);
      }, 2000);
    }, 5000);
    return () => clearInterval(i);
  }, []);

  const onSubmit = (data: z.infer<typeof schema>) => {
    submitFlow({ ...data, method: 'code' });
  };

  const onResendSubmit = () => {
    setIsResending(true);
    submitFlow({ email: route.params.identifier, method: 'code' });
  };

  return (
    <NestedScreenWOFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View>
          <Header>Verification</Header>
          <SubHeader2>
            To verify your account, please enter the code sent to your email
          </SubHeader2>
        </View>
        <View style={styles.graphicContainer}>
          <LottieView
            ref={animation}
            loop={false}
            autoPlay={false}
            source={mail}
            colorFilters={[
              {
                keypath: 'mail',
                color: isCompleteSuccess
                  ? theme.colors.successIcon
                  : theme.colors.secondaryText,
              },
            ]}
            style={{ width: 54, height: 54 }}
          />
        </View>
        <JiggleView style={styles.form} jiggle={jiggle}>
          <Controller
            control={control}
            name="code"
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
            label="Submit"
            variant="main"
            onPress={handleSubmit(onSubmit)}
            isSubmitting={isCompletingFlow && !isResending}
          />
          <SubmitButton
            label="Resend"
            variant="borderedGrayMain"
            onPress={onResendSubmit}
            isSuccess={refreshSuccess}
            isSubmitting={isCompletingFlow && isResending}
          />
        </JiggleView>
      </KeyboardAvoidingView>
    </NestedScreenWOFeedback>
  );
};

export default Verification;
