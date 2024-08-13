import { useEffect, useState } from 'react';
import { useForm, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence } from 'framer-motion';

import styles from './styles/add-user.module.scss';
import {
  withSmallModal,
  PlainTextInput,
  useColorScheme,
  MainButton,
  FormError,
  SlideMotionDiv,
  CopyButton
} from '@ledget/ui';
import { useAddUserToAccountMutation } from '@ledget/shared-features';
import { withReAuth } from '@utils/index';
import { hasErrorCode } from '@ledget/helpers';
import { useLoaded } from '@ledget/helpers';
import { Person } from '@ledget/media';

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .transform((value) => value.trim())
});

const Slide1 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });
  const [linkUser, { error, isLoading }] = useAddUserToAccountMutation({
    fixedCacheKey: 'addUserToAccount'
  });
  const { isDark } = useColorScheme();

  return (
    <form
      onSubmit={handleSubmit((data) => linkUser(data))}
      id="add-user-form"
      className={styles.addUserForm}
    >
      <h2>Add Household Member</h2>
      <div className={styles.personImage} data-dark={isDark}>
        <Person dark={isDark} />
      </div>
      <p>
        Enter the email address of the person you'd like to add to your account.
      </p>
      <PlainTextInput
        label="Email Address"
        placeholder="Enter email address"
        type="email"
        {...register('email')}
        error={errors.email as FieldError}
      />
      {hasErrorCode('ACTIVATION_LINK_FAILED', error) && (
        <FormError
          msg={
            'Woops, looks like something went wrong, please try again in a few hours.'
          }
        />
      )}
      <MainButton type="submit" submitting={isLoading} disabled={isLoading}>
        Get Invite Link
      </MainButton>
    </form>
  );
};

const Slide2 = () => {
  const [, { data, reset }] = useAddUserToAccountMutation({
    fixedCacheKey: 'addUserToAccount'
  });
  const { isDark } = useColorScheme();
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
    <div className={styles.createLinkedAccountQrCode} data-dark={isDark}>
      {data && (
        <>
          <div>
            <img src={data.recovery_link_qr} alt="qr code" />
          </div>
          <div>
            <CopyButton target={data.recovery_link} />
          </div>
          <h4>To finish, have your new account member
            scan the qr code or follow the link</h4>
          <p>
            If the new household member has not completed the process within{' '}
            {expiresIn} minutes, you will need to start the process over.
          </p>
        </>
      )}
    </div>
  );
};

const AddUserModal = withReAuth(
  withSmallModal((props) => {
    const isLoaded = useLoaded(1000);
    const [, { isSuccess }] = useAddUserToAccountMutation({
      fixedCacheKey: 'addUserToAccount'
    });

    return (
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <SlideMotionDiv key="slide2" position={isLoaded ? 'last' : 'fixed'}>
            <Slide2 />
          </SlideMotionDiv>
        ) : (
          <SlideMotionDiv key="slide1" position={isLoaded ? 'first' : 'fixed'}>
            <Slide1 />
          </SlideMotionDiv>
        )}
      </AnimatePresence>
    );
  })
);

export default AddUserModal;
