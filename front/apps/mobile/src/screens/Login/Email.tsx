import React from 'react';

import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
import { LogoIconGrayscale } from '@ledget/media/native';
import Legal from './Legal';
import { useAppearance } from '@/features/appearanceSlice';

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

  const onSubmit = (data: z.infer<typeof schema>) => {
    navigation.navigate('Aal1', { identifier: data.email });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box variant="fullCentered">
        <View style={styles.logoContainer}>
          <LogoIconGrayscale dark={mode === 'dark'} size={32} />
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
          <Button
            label="Next"
            variant="main"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
        <View style={styles.socialForm}>
          <Seperator
            label="Or Sign In With"
            variant="l"
            backgroundColor="authScreenSeperator"
          />
          <View style={styles.socialButtons}>
            <Button variant="socialSignIn" onPress={() => {}}>
              <FacebookLogo />
            </Button>
            <Button variant="socialSignIn" onPress={() => {}}>
              <GoogleLogo />
            </Button>
          </View>
        </View>
        <Legal />
      </Box>
    </TouchableWithoutFeedback>
  );
}
