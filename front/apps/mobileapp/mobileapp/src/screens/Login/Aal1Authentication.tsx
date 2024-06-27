import React from 'react'

import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { Key } from 'geist-icons-native';
import { z } from 'zod';

import styles from './styles/aal1authentication';
import { Aal1AuthenticationProps } from '@types';
import { LogoIcon } from '@ledget/media/native';
import { Header, SubHeader2, PasswordInput, Button, Seperator, Icon } from '@components'

const schema = z.object({
  password: z.string()
    .min(1, { message: 'required' })
    .transform(value => value.trim())
});

const Aal1Authentication = ({ navigation, route }: Aal1AuthenticationProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screen}>
        <View>
          <Header>Finish Logging In</Header>
          <SubHeader2>Enter your password or use a pass-key login</SubHeader2>
        </View>
        <View style={styles.form}>
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
          <Button
            label="Continue"
            variant='main'
            marginTop='xs'
            onPress={handleSubmit(onSubmit)}
          />
          <Seperator variant='xl' label='Or' />
          <Button
            label="Passkey"
            variant='grayMain'
            onPress={() => console.log('passkey')}
          >
            <Icon icon={Key} />
          </Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Aal1Authentication
