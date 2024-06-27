import { useEffect } from 'react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import styles from './styles/update-personal-info.module.scss';
import { useSearchParams } from 'react-router-dom';
import { withSmallModal } from '@ledget/ui';
import { useFlow } from '@ledget/ory';
import { useAppDispatch } from '@hooks/store';
import {
  useCompleteSettingsFlowMutation,
  useLazyGetSettingsFlowQuery,
  extendedApiSlice,
  useGetMeQuery
} from '@ledget/shared-features';
import { PlainTextInput } from '@ledget/ui';
import { SubmitForm } from '@components/pieces';
import { withReAuth } from '@utils/withReAuth';

const schema = z.object({
  traits: z.object({
    name: z.object({
      first: z.string().min(1, { message: 'required' }),
      last: z.string().min(1, { message: 'required' })
    }),
    email: z.string().email().transform(value => value.trim())
  })
});

const UpdatePersonalInfo = withReAuth(
  withSmallModal((props) => {
    const { flow, fetchFlow, completeFlow, flowStatus } = useFlow(
      useLazyGetSettingsFlowQuery,
      useCompleteSettingsFlowMutation,
      'settings'
    );
    const { isCompletingFlow, isCompleteSuccess } = flowStatus;
    const { data: user } = useGetMeQuery();
    const [searchParams, setSearchParams] = useSearchParams();
    const {
      register,
      handleSubmit,
      formState: { errors }
    } = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: {
        traits: {
          name: {
            first: user?.name.first,
            last: user?.name.last
          },
          email: user?.email
        }
      }
    });
    const dispatch = useAppDispatch();

    // On mount, fetch flow
    useEffect(() => {
      fetchFlow();
      return () => {
        searchParams.delete('flow');
        setSearchParams(searchParams);
      };
    }, []);

    // On update success
    useEffect(() => {
      let timeout: NodeJS.Timeout;
      if (isCompleteSuccess) {
        dispatch(extendedApiSlice.util.invalidateTags(['User']));
        timeout = setTimeout(() => {
          props.closeModal();
        }, 1500);
      }
      return () => {
        clearTimeout(timeout);
      };
    }, [isCompleteSuccess]);

    return (
      <div>
        <h3>Update Personal Info</h3>
        <hr />
        <form
          onSubmit={handleSubmit((data, e) =>
            completeFlow({
              data: {
                ...data,
                csrf_token: flow?.csrf_token,
                method: 'profile'
              },
              params: { flow: flow?.id }
            })
          )}
          className={styles.updatePersonalInfoForm}
        >
          <div>
            <label htmlFor="name">Name</label>
            <label htmlFor="email">Email</label>
            <PlainTextInput
              type="text"
              placeholder="First Name"
              {...register('traits.name.first')}
              error={errors.traits?.name?.first}
            />
            <PlainTextInput
              type="text"
              placeholder="Last Name"
              {...register('traits.name.last')}
              error={errors.traits?.name?.last}
            />
            <label htmlFor="email">Email</label>
            <PlainTextInput
              type="text"
              placeholder="Email"
              {...register('traits.email')}
              error={errors.traits?.email}
            />
          </div>
          <input type="hidden" value={flow?.csrf_token} name="csrf_token" />
          <SubmitForm
            submitting={isCompletingFlow}
            success={isCompleteSuccess}
            onCancel={() => props.closeModal()}
          />
        </form>
      </div>
    );
  })
);

export default UpdatePersonalInfo;
