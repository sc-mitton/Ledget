import { useEffect, useState, useRef, Fragment } from 'react';
import { View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { UserPlus, Copy } from 'geist-native-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import * as Clipboard from 'expo-clipboard';
import PagerView from 'react-native-pager-view';

import styles from './styles/add-coowner';
import { useAddUserToAccountMutation } from '@ledget/shared-features';
import {
  Modal,
  Header2,
  Button,
  Text,
  TextInput,
  Seperator,
  Icon,
  FormError,
  Base64Image,
  SlideView
} from '@ledget/native-ui';
import { hasErrorCode } from '@ledget/helpers';
import { ModalScreenProps } from '@types';

const Slide2 = () => {
  const [, { data, reset }] = useAddUserToAccountMutation({
    fixedCacheKey: 'addUserToAccount'
  });
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  useEffect(() => {
    if (data) {
      setExpiresIn(
        Math.ceil(
          (new Date(data.expires_at).getTime() - Date.now()) / 1000 / 60
        )
      );
      const interval = setInterval(() => {
        setExpiresIn(
          Math.ceil(
            (new Date(data.expires_at).getTime() - Date.now()) / 1000 / 60
          )
        );
      }, 1000 * 60);
      return () => clearInterval(interval);
    }
  }, [data]);

  useEffect(() => {
    if (expiresIn && expiresIn <= 0) {
      reset();
    }
  }, [expiresIn]);

  return (
    <View key='2'>
      <Text color='secondaryText' style={styles.text}>
        To finish, have your new account member
        scan the qr code or follow the link
      </Text>
      <Base64Image data={data?.recovery_link_qr} alt='qr code' />
      <Button
        label='Copy Link'
        labelPlacement='right'
        variant='borderedGrayMain'
        onPress={() => Clipboard.setStringAsync(data?.recovery_link || '')}
      >
        <Icon icon={Copy} />
      </Button>
      <Seperator backgroundColor='darkerseperator' />
      <Text variant='footer' style={styles.footer}>
        The link expires in {expiresIn} minutes. If the link expires, you can
        generate a new one.
      </Text>
    </View>
  )
}

const schema = z.object({
  email: z.string().email().min(1, { message: 'Email is required' })
});

const Slide1 = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });
  const [linkUser, { error }] = useAddUserToAccountMutation({
    fixedCacheKey: 'addUserToAccount'
  });

  const submitForm = () => {
    handleSubmit((data) => linkUser(data))();
  }

  return (
    <View key='1'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Fragment>
          <Text color='secondaryText' style={styles.text}>
            Enter the email address of the person you'd like to add to your account
          </Text>
          <Controller
            control={control}
            name='email'
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder='Email address...'
                value={value}
                onChangeText={onChange}
                error={errors.email}
              />
            )}
          />
          {hasErrorCode('ACTIVATION_LINK_FAILED', error) && (
            <FormError
              error={
                'Woops, looks like something went wrong, please try again in a few hours.'
              }
            />
          )}
          <Button label='Get Invite Link' variant='main' onPress={submitForm} />
          <Seperator backgroundColor='darkerseperator' />
          <Text variant='footer' style={styles.footer}>
            Members on your account will be able to see all of your data including
            account information, transactions, bills, and budget categories. Only
            add members you trust.
          </Text>
        </Fragment>
      </TouchableWithoutFeedback>
    </View>
  )
}



const AddCoOwner = (props: ModalScreenProps<'AddCoOwner'>) => {
  const [, { isSuccess }] = useAddUserToAccountMutation({
    fixedCacheKey: 'addUserToAccount'
  });
  const ref = useRef<PagerView>(null);

  useEffect(() => {
    if (isSuccess) {
      ref.current?.setPage(1);
    }
  }, [isSuccess]);

  return (
    <Modal>
      <View style={styles.header}>
        <Header2>Add Account Member</Header2>
      </View>
      <View style={styles.icon}>
        <Icon icon={UserPlus} size={30} />
      </View>
      {isSuccess
        ? <SlideView position={1} skipExit={true} ><Slide2 /></SlideView>
        : <SlideView position={0} skipEnter={true} skipExit={!isSuccess}><Slide1 /></SlideView>}
    </Modal>
  )
};

export default AddCoOwner
