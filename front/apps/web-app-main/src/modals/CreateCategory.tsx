import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';

import styles from './styles/forms.module.scss';
import { categorySchema } from '@ledget/form-schemas';
import { useAddNewCategoryMutation } from '@ledget/shared-features';
import {
  AddAlert,
  EmojiComboText,
  LimitAmountInput,
  PeriodSelect,
  emoji,
} from '@components/inputs';
import { withModal } from '@ledget/ui';
import SubmitForm from '@components/pieces/SubmitForm';
import { FormErrorTip } from '@ledget/ui';

const CreateCategoryModal = withModal((props) => {
  const location = useLocation();
  const [emoji, setEmoji] = useState<emoji>();
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
          const em = typeof emoji === 'string' ? emoji : emoji?.native;
          addNewCategory({ ...data, emoji: em });
        })}
        id="new-cat-form"
        className={styles.createForm}
      >
        <div>
          <EmojiComboText
            emoji={emoji}
            setEmoji={setEmoji}
            name="name"
            placeholder="Name"
            register={register}
            error={errors.name}
          />
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
            default={location.state?.period}
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
