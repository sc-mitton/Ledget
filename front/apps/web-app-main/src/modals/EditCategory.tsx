import { useEffect, useState } from 'react';

import { useForm, useWatch, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import styles from './styles/forms.module.scss';
import { useUpdateCategoriesMutation, Category } from '@ledget/shared-features';
import {
  AddAlert,
  EmojiPicker,
  LimitAmountInput,
  PeriodSelect,
  emoji,
} from '@components/inputs';
import SubmitForm from '@components/pieces/SubmitForm';
import { FormErrorTip, TextInputWrapper } from '@ledget/ui';
import { categorySchema } from '@ledget/form-schemas';

export const EditCategory = (props: {
  category: Category;
  onClose: () => void;
}) => {
  const [emoji, setEmoji] = useState<emoji>();
  const [
    updateCategory,
    { isSuccess: categoryIsUpdated, isLoading: isUpdatingCategory },
  ] = useUpdateCategoriesMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      name:
        props.category.name.charAt(0).toUpperCase() +
        props.category.name.slice(1),
    },
  });
  const watchLimitAmount = useWatch({ control, name: 'limit_amount' });

  // Close Modal on success
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (categoryIsUpdated) {
      timeout = setTimeout(() => {
        props.onClose();
      }, 1000);
    }
  }, [categoryIsUpdated]);

  // Set emoji on load
  useEffect(() => {
    if (props.category.emoji) setEmoji(props.category.emoji);
  }, []);

  const onSubmit = (data: z.infer<typeof categorySchema>) => {
    const payload = { id: props.category.id } as any;
    if (
      data.limit_amount !== props.category.limit_amount &&
      props.category.id
    ) {
      // If the limit amount is changed, we'll need to create
      // a new category on the backend, so we pass all the data
      updateCategory({
        id: props.category.id,
        ...data,
      });
    } else {
      let k: keyof typeof data;
      for (k in data) if (data[k] !== props.category[k]) payload[k] = data[k];
      updateCategory(payload);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit((data, e) => onSubmit(data))}
        id="new-cat-form"
        className={styles.createForm}
      >
        <h3>Edit Category</h3>
        <hr />
        <div className={styles.splitInputs}>
          <div className={styles.emojiNameContainer}>
            <label htmlFor="emoji">Emoji</label>
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
            <LimitAmountInput
              defaultValue={props.category.limit_amount || 0}
              control={control}
            >
              <FormErrorTip
                error={errors.limit_amount && (errors.limit_amount as any)}
              />
            </LimitAmountInput>
          </div>
        </div>
        <div className={styles.extraPaddedRow}>
          <div>
            <Controller
              name="period"
              control={control}
              render={(props) => (
                <PeriodSelect
                  name="period"
                  labelPrefix={'Resets'}
                  excludeOnce={true}
                  value={props.field.value}
                  onChange={(e) => {
                    props.field.onChange(e);
                  }}
                />
              )}
            />
          </div>
          <div>
            <AddAlert
              control={control}
              limitAmount={watchLimitAmount}
              defaultValues={props.category.alerts}
            />
          </div>
        </div>
        <SubmitForm
          success={categoryIsUpdated}
          submitting={isUpdatingCategory}
          onCancel={() => props.onClose()}
        />
      </form>
    </div>
  );
};
