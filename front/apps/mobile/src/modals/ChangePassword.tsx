import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock } from 'geist-native-icons';

import styles from './styles/change-password';
import {
  Modal,
  Header2,
  Text,
  JiggleView,
  PasswordInput,
  Seperator,
  SlideView,
  SubmitButton,
  Icon,
  Box,
} from '@ledget/native-ui';
import {
  useLazyGetSettingsFlowQuery,
  useCompleteSettingsFlowMutation,
  useLazyGetLoginFlowQuery,
  useCompleteLoginFlowMutation,
} from '@/features/orySlice';
import { useNativeFlow } from '@ledget/ory';
import { useGetMeQuery } from '@ledget/shared-features';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  selectAuthIsFresh,
  updateIsAuthed,
  selectLastAuthedAt,
} from '@/features/authSlice';
import { ModalScreenProps } from '@types';

const changeSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: 'required' })
      .min(10, { message: 'Password must be at least 10 characters' }),
    confirmPassword: z.string().min(1, { message: 'required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

const ChangePassword = ({ closeModal }: { closeModal: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof changeSchema>>({
    resolver: zodResolver(changeSchema),
  });

  const { submitFlow, flowStatus, fetchFlow } = useNativeFlow(
    useLazyGetSettingsFlowQuery,
    useCompleteSettingsFlowMutation,
    'settings'
  );

  useEffect(() => {
    fetchFlow();
  }, []);

  useEffect(() => {
    if (flowStatus.isCompleteSuccess) {
      const timeout = setTimeout(() => {
        closeModal();
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [flowStatus.isCompleteSuccess]);

  const onSubmit = () => {
    handleSubmit((data) =>
      submitFlow({
        method: 'password',
        ...data,
      })
    )();
  };

  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Box marginVertical="s">
          <Icon icon={Lock} size={24} />
        </Box>
        <Header2>Change Password</Header2>
        <Text color="secondaryText">
          Choose a new password for your account
        </Text>
      </View>
      <Seperator backgroundColor="modalSeperator" variant="l" />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <PasswordInput
            value={value}
            placeholder="New password"
            onChangeText={onChange}
            error={errors.password}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <PasswordInput
            placeholder="Confirm password"
            confirmer={true}
            value={value}
            onChangeText={onChange}
            error={errors.confirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        )}
      />
      <SubmitButton
        onPress={onSubmit}
        label="Save"
        variant="main"
        isLoading={flowStatus.isCompletingFlow}
        isSuccess={flowStatus.isCompleteSuccess}
      />
      <Seperator backgroundColor="modalSeperator" variant="s" />
      <Text variant="footer" marginHorizontal="m">
        Once your password is updated, all other devices will be logged out.
      </Text>
    </View>
  );
};

const confirmSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

const ConfirmPassword = ({
  setPasswordConfirmed,
}: {
  setPasswordConfirmed: (value: boolean) => void;
}) => {
  const dispatch = useAppDispatch();

  const { data: user } = useGetMeQuery();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof confirmSchema>>({
    resolver: zodResolver(confirmSchema),
  });
  const { submitFlow, flowStatus, fetchFlow } = useNativeFlow(
    useLazyGetLoginFlowQuery,
    useCompleteLoginFlowMutation,
    'login'
  );

  useEffect(() => {
    fetchFlow({ refresh: true, aal: 'aal1' });
  }, []);

  useEffect(() => {
    if (flowStatus.isCompleteSuccess) {
      const timeout = setTimeout(() => {
        setPasswordConfirmed(true);
        dispatch(updateIsAuthed());
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [flowStatus.isCompleteSuccess]);

  const onSubmit = () => {
    handleSubmit((data) =>
      submitFlow({
        method: 'password',
        identifier: user?.email,
        ...data,
      })
    )();
  };

  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Header2>Confirm Password</Header2>
        <Text color="secondaryText">
          First, confirm your current password to continue.
        </Text>
      </View>
      <Seperator backgroundColor="modalSeperator" variant="l" />
      <JiggleView jiggle={flowStatus.isCompleteError}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <PasswordInput
              placeholder="Password..."
              value={value}
              onChangeText={onChange}
              error={errors.password}
            />
          )}
        />
        <SubmitButton
          variant="main"
          onPress={onSubmit}
          label="Confirm"
          isSubmitting={flowStatus.isCompletingFlow}
          isSuccess={flowStatus.isCompleteSuccess}
        />
      </JiggleView>
    </View>
  );
};

const ChangePasswordModal = (props: ModalScreenProps<'ChangePassword'>) => {
  const [passwordConfirmed, setPasswordConfirmed] = React.useState(false);
  const authIsFresh = useAppSelector(selectAuthIsFresh);
  const lastAuthedAt = useAppSelector(selectLastAuthedAt);

  return (
    <Modal>
      {passwordConfirmed || authIsFresh ? (
        <SlideView
          position={1}
          skipExit={true}
          skipEnter={Date.now() - lastAuthedAt > 3000 && authIsFresh}
        >
          <ChangePassword closeModal={props.navigation.goBack} />
        </SlideView>
      ) : (
        <SlideView position={0} skipEnter={true}>
          <ConfirmPassword setPasswordConfirmed={setPasswordConfirmed} />
        </SlideView>
      )}
    </Modal>
  );
};

export default ChangePasswordModal;
