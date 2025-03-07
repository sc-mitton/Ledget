import { useRef } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { QuestionCircle } from '@geist-ui/icons';

import styles from './styles/custom-category.module.scss';
import {
  EmojiPicker,
  LimitAmountInput,
  PeriodSelect,
  AddAlert,
} from '@components/inputs';
import {
  Window,
  PlainTextInput,
  Tooltip,
  BlueSubmitButton,
  SecondaryButton,
} from '@ledget/ui';
import { categorySchema } from '@ledget/form-schemas';
import Present from '../Present';
import { useAddCategoriesContext } from './Context';

const CustomCategory = () => {
  const { setListItems } = useAddCategoriesContext();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
  });

  const cancelRef = useRef<HTMLButtonElement>(null);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit((data) => {
      const newItem = {
        ...data,
        id: `custom-${Math.random().toString(36).substring(2, 15)}`,
      };
      setListItems((prev) => [newItem, ...prev]);
      cancelRef.current?.click();
    })(e);
  };
  const watchLimitAmount = useWatch({ control, name: 'limit_amount' });

  return (
    <Window className={styles.customCategoryWindow}>
      <h2>{'Custom Category'}</h2>
      <hr />
      <form onSubmit={submitForm}>
        <div className={styles.emojiNameContainer}>
          <label htmlFor="name">Name</label>
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
            <PlainTextInput
              error={errors.name}
              {...register('name')}
              placeholder="Name"
            />
          </div>
        </div>
        <div className={styles.inputsRow}>
          <div>
            <LimitAmountInput control={control} withCents={false} />
          </div>
          <div>
            <div className={styles.alertsLabel}>
              <label htmlFor="reminders">Alerts</label>
              <Tooltip
                msg="Get push notifications before you reach spending amounts for this category."
                maxWidth={'200px'}
              >
                <QuestionCircle />
              </Tooltip>
            </div>
            <AddAlert limitAmount={watchLimitAmount} control={control} />
          </div>
        </div>
        <div className={styles.inputsRow}>
          <div>
            <label htmlFor="schedule">Schedule</label>
            <Controller
              name="period"
              control={control}
              render={(props) => {
                return (
                  <PeriodSelect
                    name="period"
                    labelPrefix="Refreshes"
                    excludeOnce={true}
                    value={props.field.value}
                    onChange={(e) => {
                      props.field.onChange(e);
                    }}
                    error={errors.period}
                  />
                );
              }}
            />
          </div>
          <div></div>
        </div>
        <div className={styles.formButtons}>
          <Present.Trigger as={SecondaryButton} type="button" ref={cancelRef}>
            Cancel
          </Present.Trigger>
          <BlueSubmitButton type="submit">Save</BlueSubmitButton>
        </div>
      </form>
    </Window>
  );
};

export default function () {
  return (
    <Present.Presentation>
      <CustomCategory />
    </Present.Presentation>
  );
}
