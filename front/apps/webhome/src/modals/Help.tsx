import { withModal } from '@ledget/ui';

import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import styles from './styles/help.module.scss';
import { useEmailUserMutation } from '@ledget/shared-features';
import { TextInputWrapper, FormErrorTip, BakedListBox } from '@ledget/ui';
import { SubmitForm } from '@components/pieces';
import { useEffect } from 'react';

const schema = z.object({
  issue: z.string().min(1, { message: 'required' }),
  detail: z.string().min(1, { message: 'required' })
});

const IssueOptions = [
  { label: 'Problem with account', value: 'ACCOUNT_PROBLEM', id: 1 },
  { label: 'Billing Issue', value: 'BILLING', id: 2 },
  { label: 'I have a question', value: 'QUESTION', id: 3 },
  { label: 'Report a bug', value: 'BUG', id: 4 },
  { label: 'Make a suggestion', value: 'SUGGESTION', id: 5 },
  { label: 'Other', value: 'OTHER', id: 6 }
];

const HelpModal = withModal((props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    clearErrors
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur'
  });
  const values = useWatch({ control, name: ['issue', 'detail'] });
  const [emailUser, { isLoading, isSuccess }] = useEmailUserMutation();

  useEffect(() => {
    // Lower error for issue after the value is set
    values[0] && clearErrors('issue');
  }, [values]);

  // On success, close the modal
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isSuccess) {
      timeout = setTimeout(() => {
        props.closeModal();
      }, 1000);
    }
  }, [isSuccess]);

  return (
    <div className={styles.helpModal}>
      <h1>Help</h1>
      <div>
        <p>
          If you need help with your account, or have feedback, fill out the
          form below and we'll get back to you as soon as possible.
        </p>
      </div>
      <form onSubmit={handleSubmit(emailUser)}>
        <fieldset>
          <label htmlFor="issue">Issue</label>
          <BakedListBox
            options={IssueOptions}
            control={control as any}
            error={errors.issue}
            name="issue"
          />
          <label htmlFor="issue">Additional Details</label>
          <TextInputWrapper>
            <textarea
              placeholder="Message"
              {...register('detail')}
              maxLength={300}
            />
            {values[1] && <span>{`${300 - (values[1]?.length || 0)}`}</span>}
            <FormErrorTip error={errors.detail} />
          </TextInputWrapper>
        </fieldset>
        <SubmitForm
          success={isSuccess}
          submitting={isLoading}
          onCancel={() => props.closeModal()}
        />
      </form>
    </div>
  );
});

export default HelpModal;
