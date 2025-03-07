import { useForm, Controller, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { QuestionCircle, Edit2 } from '@geist-ui/icons';
import dayjs from 'dayjs';

import styles from './styles/custom-bill.module.scss';
import {
  EmojiPicker,
  DollarRangeInput,
  AddReminder,
  BillScheduler,
  PeriodSelect,
} from '@components/inputs';
import {
  Window,
  TextInputWrapper,
  Checkbox,
  DatePicker,
  Tooltip,
  BlueSubmitButton,
  SecondaryButton,
} from '@ledget/ui';
import { billSchema } from '@ledget/form-schemas';
import Present from '../Present';
import { useAddBillsContext } from './Context';
import { NewBill } from '@ledget/shared-features';

const CustomBill = ({ bill }: { bill?: NewBill & { id: string } }) => {
  const { setSelectedItems, setListItems } = useAddBillsContext();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof billSchema>>({
    resolver: zodResolver(billSchema),
    defaultValues: bill,
  });
  const billPeriod = useWatch({ control, name: 'period' });
  const rangeMode = useWatch({ control, name: 'range' });

  const submitForm = handleSubmit((data) => {
    if (bill) {
      // Update bill
      setListItems((prev) =>
        prev.map((item) => (item.id === bill.id ? { ...item, ...data } : item))
      );
    } else {
      const newItem = {
        ...data,
        id: Math.random().toString(36).substring(2, 15),
      };
      setListItems((prev) => [newItem, ...prev]);
      setSelectedItems((prev) => [newItem.id, ...prev]);
    }
  });

  return (
    <Window className={styles.customBillWindow}>
      <h2>{bill ? 'Edit Bill' : 'Custom Bill'}</h2>
      <hr />
      <form onSubmit={submitForm}>
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
                    labelPrefix="Repeats"
                    excludeOnce={true}
                    value={props.field.value}
                    onChange={(e) => {
                      props.field.onChange(e);
                    }}
                  />
                );
              }}
            />
          </div>
          <div>
            <BillScheduler
              billPeriod={billPeriod}
              error={errors.schedule?.day}
              register={register}
              defaultValue={{
                day: bill?.day,
                month: bill?.month,
                week: bill?.week,
                weekDay: bill?.week_day,
              }}
            />
          </div>
        </div>
        <div className={styles.emojiNameContainer}>
          <label htmlFor="name">Name</label>
          <div>
            <Controller
              name="emoji"
              control={control}
              render={(props) => (
                <EmojiPicker
                  emoji={props.field.value}
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
        <div className={styles.inputsRow}>
          <div>
            <DollarRangeInput
              rangeMode={rangeMode}
              control={control}
              errors={errors}
              defaultUpperValue={bill?.upper_amount}
            />
          </div>
        </div>
        <Controller
          name="range"
          control={control}
          render={(props) => (
            <Checkbox
              checked={props.field.value}
              setChecked={props.field.onChange}
              label="Range"
              id="range"
              aria-label="Change bill amount to a range."
            />
          )}
        />
        <div className={styles.inputsRow}>
          <div>
            <label htmlFor="expires">Expires</label>
            <Controller
              name="expires"
              control={control}
              render={(props) => (
                <DatePicker
                  disabled={[[undefined, dayjs().subtract(1, 'day')]]}
                  disabledStyle="muted"
                  placeholder="Date"
                  format="M/D/YYYY"
                  aria-label="Expiration date"
                  onChange={(e) => {
                    props.field.onChange(e?.toISOString());
                  }}
                />
              )}
            />
          </div>
          <div>
            <div className={styles.remindersLabel}>
              <label htmlFor="reminders">Reminders</label>
              <Tooltip
                msg="Get push notifications before your bill is scheduled."
                maxWidth={'200px'}
              >
                <QuestionCircle />
              </Tooltip>
            </div>
            <AddReminder control={control} name="reminders" />
          </div>
        </div>
        <div className={styles.formButtons}>
          <Present.Trigger as={SecondaryButton} type="button">
            Cancel
          </Present.Trigger>
          <Present.Trigger as={BlueSubmitButton}>Save</Present.Trigger>
        </div>
      </form>
    </Window>
  );
};

export default function ({ bill }: { bill?: NewBill & { id: string } }) {
  return (
    <Present.Presentation>
      <CustomBill bill={bill} />
    </Present.Presentation>
  );
}
