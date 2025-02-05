import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';

import styles from './styles/forms.module.scss';
import { categorySchema } from '@ledget/form-schemas';
import { useAddNewCategoryMutation } from '@ledget/shared-features';
import {
  AddAlert,
  EmojiPicker,
  LimitAmountInput,
  PeriodSelect,
  emoji,
} from '@components/inputs';
import { withModal, TextInputWrapper } from '@ledget/ui';
import SubmitForm from '@components/pieces/SubmitForm';
import { FormErrorTip } from '@ledget/ui';

const CreateCategoryModal = withModal((props) => {
  const [addNewCategory, { isLoading, isSuccess }] =
    useAddNewCategoryMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });
  const watchLimitAmount = useWatch({ control, name: 'limit_amount' });

  useEffect(() => {
    isSuccess && props.closeModal();
  }, [isSuccess]);

  return (
    <>
      <h3>New Category</h3>
      <hr />
      <form
        onSubmit={handleSubmit((data, e) => {
          addNewCategory({ ...data });
        })}
        id="new-cat-form"
        className={styles.createForm}
      >
        <div className={styles.emojiNameContainer}>
          <label htmlFor="schedule">Name</label>
          <div>
            <Controller
              name="emoji"
              control={control}
              render={(props) => (
                <EmojiPicker
                  emoji={props.field.value || undefined}
                  setEmoji={(e: any) => {
                    props.field.onChange(e?.native);
                  }}
                />
              )}
            />
            <TextInputWrapper>
              <input type="text" placeholder="Name" {...register('name')} />
            </TextInputWrapper>
          </div>
        </div>
        <div>
          <LimitAmountInput withCents={false} control={control}>
            <FormErrorTip error={errors.limit_amount} />
          </LimitAmountInput>
        </div>
        <div className={styles.multiInputRow}>
          <PeriodSelect
            name="period"
            control={control}
            labelPrefix={'Resets'}
            excludeOnce={true}
          />
          <div>
            <AddAlert limitAmount={watchLimitAmount} control={control} />
          </div>
        </div>
        <SubmitForm
          submitting={isLoading}
          onCancel={() => props.closeModal()}
        />
      </form>
    </>
  );
});

export default () => {
  const navigate = useNavigate();

  return (
    <CreateCategoryModal
      onClose={() => navigate(-1)}
      maxWidth={'21.875rem'}
      minWidth={'0'}
      blur={2}
    />
  );
};
