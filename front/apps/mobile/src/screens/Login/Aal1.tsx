import React, { useEffect } from 'react';

import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Key, Lock } from 'geist-native-icons';
import { z } from 'zod';

import styles from './styles/aal1';
import sharedStyles from './styles/shared';
import {
  Header,
  SubHeader2,
  PasswordInput,
  Button,
  SubmitButton,
  Seperator,
  Icon,
  JiggleView,
  FormError,
  NestedScreenWOFeedback
} from '@ledget/native-ui';
import { LoginScreenProps } from '@types';
import { useNativeFlow } from '@ledget/ory';
import {
  useLazyGetLoginFlowQuery,
  useCompleteLoginFlowMutation
} from '@features/orySlice';
import { useFlowProgress } from '@hooks';

const schema = z.object({
  password: z
    .string()
    .min(1, { message: 'required' })
    .transform((value) => value.trim())
});

const Aal1Authentication = ({
  navigation,
  route
}: LoginScreenProps<'Aal1'>) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit'
  });
  const {
    fetchFlow,
    submitFlow,
    flowStatus: {
      isCompleteSuccess,
      isCompletingFlow,
      isCompleteError,
      errMsg
    },
    result
  } = useNativeFlow(
    useLazyGetLoginFlowQuery,
    useCompleteLoginFlowMutation,
    'login'
  );

  useEffect(() => fetchFlow({ aal: 'aal1' }), []);
  useFlowProgress({
    navigation,
    route,
    updateProgress: isCompleteSuccess,
    token: result?.session_token,
    id: result?.session.id
  });

  // Submit the form
  const onSubmit = (data: z.infer<typeof schema>) => {
    submitFlow({
      ...data,
      identifier: route.params.identifier,
      method: 'password'
    });
  };

  return (
    <NestedScreenWOFeedback>
      <View style={sharedStyles.header}>
        <Header>Finish Logging In</Header>
        <SubHeader2>Enter your password or use a pass-key login</SubHeader2>
      </View>
      <JiggleView style={styles.form} jiggle={isCompleteError}>
        <Controller
          control={control}
          name="password"
          rules={{ required: 'This is a required field' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              label={true}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password}
            />
          )}
        />
        <FormError error={errMsg} />
        <SubmitButton
          label="Submit"
          variant="main"
          isSubmitting={isCompletingFlow}
          isSuccess={isCompleteSuccess}
          onPress={handleSubmit(onSubmit)}
        />
        <Seperator variant="l" label="Or" backgroundColor='authScreenSeperator' />
        <Button
          label="Passkey"
          variant="grayMain"
          onPress={() => console.log('passkey')}
        >
          <Icon icon={Key} />
        </Button>
      </JiggleView>
      <View style={styles.bottomButton}>
        <Button
          label="Recover Account"
          variant="grayLinkButton"
          onPress={() =>
            navigation.navigate('Recovery', {
              identifier: route.params.identifier
            })
          }
        />
        <View style={styles.forgotIconContainer}>
          <Icon icon={Lock} color="tertiaryText" size={18} />
        </View>
      </View>
    </NestedScreenWOFeedback>
  );
};

export default Aal1Authentication;
