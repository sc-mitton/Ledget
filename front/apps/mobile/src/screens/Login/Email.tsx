import { useEffect } from 'react';

import * as WebBrowser from 'expo-web-browser';
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as AuthSession from 'expo-auth-session';

import styles from './styles/email';
import {
  Header,
  SubHeader2,
  TextInput,
  Button,
  Seperator,
  Box,
} from '@ledget/native-ui';
import { FacebookLogo, GoogleLogo } from '@ledget/media/native';
import { LoginScreenProps } from '@types';
import { LogoIcon } from '@ledget/media/native';
import Legal from './Legal';
import { useAppearance } from '@/features/appearanceSlice';
import { useNativeFlow } from '@ledget/ory';
import {
  useLazyGetLoginFlowQuery,
  useCompleteLoginFlowMutation,
} from '@features/orySlice';
import { useFlowProgress } from '@hooks';
import { ENV } from '@env';

const schema = z.object({
  email: z
    .string()
    .min(1, { message: 'required' })
    .email({ message: 'Invalid email' })
    .transform((value) => value.trim()),
});

export default function Email({
  navigation,
  route,
}: LoginScreenProps<'Email'>) {
  const { mode } = useAppearance();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  const {
    flow,
    fetchFlow,
    submitFlow,
    flowStatus: { isCompleteSuccess, completeError },
    result,
  } = useNativeFlow(
    useLazyGetLoginFlowQuery,
    useCompleteLoginFlowMutation,
    'login'
  );

  useEffect(
    () => fetchFlow({ aal: 'aal1', return_session_token_exchange_code: true }),
    []
  );

  const onRedirect = async () => {
    const result = await WebBrowser.openAuthSessionAsync(
      completeError.data.redirect_browser_to,
      AuthSession.makeRedirectUri({
        preferLocalhost: ENV === 'dev',
      })
    );
    if (result.type === 'success') {
      const returnToCode = new URL(result.url).searchParams.get('code');
      if (!returnToCode) {
        console.log(
          'The provider did not include a code, refetching flow. This is likely due to an error in the flow.',
          'The url was: ',
          result.url
        );
        return fetchFlow({
          aal: 'aal1',
          return_session_token_exchange_code: true,
        });
      }
      submitFlow({ returnToCode });
    }
  };

  useFlowProgress({
    navigation,
    route,
    updateProgress: isCompleteSuccess,
    token: result?.session_token,
    id: result?.session.id,
  });

  useEffect(() => {
    if (completeError && completeError.data?.redirect_browser_to) {
      onRedirect();
    }
  }, [completeError]);

  const onNext = (data: z.infer<typeof schema>) => {
    navigation.navigate('Aal1', { identifier: data.email });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box variant="fullCentered">
        <View style={styles.logoContainer}>
          <LogoIcon dark={mode === 'dark'} size={64} />
        </View>
        <Header fontSize={32} lineHeight={44} style={styles.header}>
          Welcome Back
        </Header>
        <SubHeader2 style={styles.header} color="blueText">
          Please log in to continue
        </SubHeader2>
        <View style={styles.form}>
          <Controller
            control={control}
            rules={{ required: 'This is a required field' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
                placeholder="Email"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="go"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email}
              />
            )}
            name="email"
          />
          <Button label="Next" variant="main" onPress={handleSubmit(onNext)} />
        </View>
        <View style={styles.socialForm}>
          <Seperator
            label="Or Sign In With"
            variant="l"
            backgroundColor="authScreenSeperator"
          />
          <View style={styles.socialButtons}>
            <Button
              variant="socialSignIn"
              onPress={() => {
                submitFlow({
                  method: 'oidc',
                  provider: 'google',
                });
              }}
            >
              <FacebookLogo />
            </Button>
            <Button
              variant="socialSignIn"
              onPress={() => {
                submitFlow({
                  method: 'oidc',
                  provider: 'google',
                });
              }}
            >
              <GoogleLogo />
            </Button>
          </View>
        </View>
        <Legal />
      </Box>
    </TouchableWithoutFeedback>
  );
}
