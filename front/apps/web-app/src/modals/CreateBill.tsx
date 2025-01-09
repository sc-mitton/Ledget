import { useState, useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { z } from 'zod';
import dayjs from 'dayjs';

import styles from './styles/forms.module.scss';
import SubmitForm from '@components/pieces/SubmitForm';
import { withModal, DatePicker } from '@ledget/ui';
import {
  EmojiComboText,
  DollarRangeInput,
  AddReminder,
  BillScheduler,
  PeriodSelect,
  emoji,
} from '@components/inputs';
import { Checkbox } from '@ledget/ui';
import { useAddnewBillMutation } from '@ledget/shared-features';
import type { Reminder } from '@ledget/shared-features';
import { billSchema } from '@ledget/form-schemas';

export const extractReminders = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.target as any);
  let body = Object.fromEntries(formData as any);

  // Extract reminder objects
  let reminders: Reminder[] = [];
  for (const [key, value] of Object.entries(body)) {
    if (key.includes('reminder')) {
      const values = key.match(/\[(\w+)\]/g)?.map((match) => {
        const matches = /[\w]+/.exec(match);
        return matches ? matches[0] : '';
      });

      if (!values) {
        continue;
      }

      const index = parseInt(values[0]);
      reminders[index] = { ...reminders[index], [values[1]]: value };

      delete body[key];
    }
  }

  return reminders;
};

const Form = withModal((props) => {
  const [addNewBill, { isLoading, isSuccess }] = useAddnewBillMutation();
  const [rangeMode, setRangeMode] = useState(false);
  const location = useLocation();
  const [emoji, setEmoji] = useState<emoji>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof billSchema>>({
    resolver: zodResolver(billSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: location.state,
  });

  useEffect(() => {
    isSuccess && props.closeModal();
  }, [isSuccess]);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit((data) => {
      const em = typeof emoji === 'string' ? emoji : emoji?.native;
      const reminders = extractReminders(e);
      addNewBill({ reminders, ...data, emoji: em });
    })(e);
  };

  const billPeriod = useWatch({ control, name: 'period' });

  return (
    <>
      <h3>New Bill</h3>
      <hr />
      <form
        className={[styles.createForm, styles.newBillForm].join(' ')}
        onSubmit={submitForm}
      >
        <div>
          <label htmlFor="schedule">Schedule</label>
          <div className={styles.multiInputRow}>
            <div>
              <PeriodSelect
                name="period"
                control={control}
                enableAll={true}
                default={location.state?.period}
              />
            </div>
            {billPeriod !== 'once' && (
              <BillScheduler
                defaultValue={{
                  day: location.state?.day,
                  week: location.state?.week,
                  weekDay: location.state?.weekDay,
                  month: location.state?.month,
                }}
                billPeriod={billPeriod}
                error={errors.schedule?.day}
                register={register}
              />
            )}
            <AddReminder />
          </div>
        </div>
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
        <div className={styles.paddedRow}>
          <DollarRangeInput
            rangeMode={rangeMode}
            control={control}
            errors={errors}
            defaultUpperValue={location.state?.upper_amount}
          />
          <div className={styles.rangeCheckboxContainer}>
            <Checkbox
              checked={rangeMode}
              setChecked={setRangeMode}
              label="Range"
              id="range"
              aria-label="Change bill amount to a range."
            />
          </div>
        </div>
        <div className={styles.paddedRow} style={{ width: '50%' }}>
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
        <SubmitForm
          submitting={isLoading}
          onCancel={() => props.closeModal()}
        />
      </form>
    </>
  );
});

export default function () {
  const navigate = useNavigate();

  return (
    <Form
      onClose={() => navigate('/budget')}
      maxWidth={'21.875rem'}
      minWidth={'0'}
      blur={2}
    />
  );
}
