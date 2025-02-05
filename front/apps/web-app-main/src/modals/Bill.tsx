import { useId, useState, useEffect } from 'react';

import { AnimatePresence } from 'framer-motion';
import { RadioGroup } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import dayjs from 'dayjs';
import {
  Trash2,
  Edit2,
  CheckInCircle,
  BellOff,
  MoreHorizontal,
} from '@geist-ui/icons';
import { startCase, toLower } from 'lodash-es';

import styles from './styles/bill.module.scss';
import { withModal } from '@ledget/ui';
import {
  TransformedBill,
  useDeleteBillMutation,
  useUpdateBillsMutation,
  UpdateBill,
} from '@ledget/shared-features';
import { SubmitForm } from '@components/pieces';
import { getOrderSuffix } from '@ledget/helpers';
import { mapWeekDayNumberToName } from '@ledget/helpers';
import {
  DollarCents,
  SlideMotionDiv,
  Checkbox,
  IconButtonHalfGray,
  DestructiveTextButton,
  DatePicker,
  NestedWindow2,
  WindowCorner,
  TextInputWrapper,
  StyledMenu,
  GrayButton,
} from '@ledget/ui';
import { useLoaded } from '@ledget/helpers';
import { extractReminders } from '@modals/CreateBill';
import {
  EmojiPicker,
  DollarRangeInput,
  BillScheduler,
  AddReminder,
} from '@components/inputs';
import { billSchema } from '@ledget/form-schemas';
import { getNextBillDate } from '@ledget/helpers';

const getRepeatsDescription = ({
  day,
  week,
  week_day,
  month,
  year,
}: {
  day: number | undefined;
  week: number | undefined;
  week_day: number | undefined;
  month: number | undefined;
  year: number | undefined;
}) => {
  if (year && month && day) {
    return `One time on ${new Date(year, month, day).toLocaleDateString(
      'en-US',
      { month: 'short', day: 'numeric', year: 'numeric' }
    )}`;
  } else if (month) {
    return `Yearly on ${new Date(2000, month, day).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`;
  } else if (week_day && week) {
    return `The ${week_day}${getOrderSuffix(week_day)} ${mapWeekDayNumberToName(
      week
    )} of the month`;
  } else if (day) {
    return `The ${day}${getOrderSuffix(day)} of every month`;
  } else {
    return '';
  }
};

type Action = 'delete' | 'edit' | 'none';

const Actions = ({
  setAction,
}: {
  setAction: React.Dispatch<React.SetStateAction<Action>>;
}) => {
  const [openEllipsis, setOpenEllipsis] = useState(false);

  return (
    <WindowCorner>
      <StyledMenu>
        <StyledMenu.Button
          as={IconButtonHalfGray}
          onClick={() => setOpenEllipsis(!openEllipsis)}
        >
          <MoreHorizontal />
        </StyledMenu.Button>
        <StyledMenu.Items>
          <StyledMenu.Item
            label="Edit Bill"
            icon={<Edit2 className="icon" />}
            onClick={() => setAction('edit')}
          />
          <StyledMenu.Item
            label="Delete Bill"
            destructive
            icon={<Trash2 className="icon" />}
            onClick={() => setAction('delete')}
          />
        </StyledMenu.Items>
      </StyledMenu>
    </WindowCorner>
  );
};

const BillInfo = ({ bill }: { bill: TransformedBill }) => {
  return (
    <div className={styles.billInfoModal}>
      <div className={styles.header}>
        {bill && (
          <h2>
            {bill.emoji}&nbsp;&nbsp;
            {`${bill.name.charAt(0).toUpperCase()}${bill?.name.slice(1)}`}
          </h2>
        )}
      </div>
      <NestedWindow2>
        <div>Amount</div>
        <div>
          <div>
            {bill.lower_amount && (
              <>
                <DollarCents value={bill.lower_amount} />{' '}
                <span>&nbsp;-&nbsp;</span>
              </>
            )}
            {bill.upper_amount && <DollarCents value={bill.upper_amount} />}
          </div>
        </div>
        <div>Schedule</div>
        <div>
          {getRepeatsDescription({
            day: bill?.day,
            week: bill?.week,
            week_day: bill?.week_day,
            month: bill?.month,
            year: bill?.year,
          })}
        </div>
        <div>Created</div>
        <div>{dayjs(bill.created).format('MMM D, YYYY')}</div>
      </NestedWindow2>
      <NestedWindow2>
        <div>Paid</div>
        <div>
          {bill?.is_paid ? (
            <CheckInCircle size={'1em'} />
          ) : (
            <span>&mdash;</span>
          )}
        </div>
        <div>Next</div>
        <div>
          {bill?.is_paid
            ? `${getNextBillDate(bill)}`
            : `${new Date(bill.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}`}
        </div>
        {bill?.expires && (
          <>
            <div>Expires</div>
            <div>
              {`${new Date(bill.expires).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}`}
            </div>
          </>
        )}
      </NestedWindow2>
      <NestedWindow2>
        <div>Reminders</div>
        <div>
          {bill.reminders && bill.reminders?.length > 0 ? (
            <>
              {bill.reminders.map((reminder, i) => (
                <span key={`reminder-${i}`}>
                  {`${reminder.offset} `}
                  {`${reminder.period}${reminder.offset > 1 ? 's' : ''} before`}
                </span>
              ))}
            </>
          ) : (
            <BellOff size={'1.1em'} />
          )}
        </div>
      </NestedWindow2>
    </div>
  );
};

const DeleteBill = ({
  bill,
  onCancel,
  onDelete,
}: {
  bill?: TransformedBill;
  onCancel: () => void;
  onDelete: () => void;
}) => {
  const [deleteBill, { isLoading: isDeleting, isSuccess: isDeleteSuccess }] =
    useDeleteBillMutation();
  const [value, setValue] = useState('all' as 'all' | 'single' | 'complement');

  const onSubmit = (e: any) => {
    e.preventDefault();
    deleteBill({
      billId: bill?.id || '',
      data: { instances: value },
    });
  };

  useEffect(() => {
    if (isDeleteSuccess) {
      onDelete();
    }
  }, [isDeleteSuccess]);

  return (
    <form onSubmit={onSubmit}>
      <RadioGroup
        className={styles.deleteBillRadios}
        value={value}
        onChange={setValue}
      >
        <RadioGroup.Label className={bill?.period}>
          <h3>
            Delete{' '}
            {`${bill?.name.charAt(0).toUpperCase()}${
              bill?.name.slice(1) || ''
            }`}{' '}
            Bill
          </h3>
        </RadioGroup.Label>
        <RadioGroup.Option value="single" className={styles.radioOption}>
          <span role="button" />
          <span>Just this month's bill</span>
        </RadioGroup.Option>
        <RadioGroup.Option value="complement" className={styles.radioOption}>
          <span role="button" />
          <span>All future bills</span>
        </RadioGroup.Option>
        <RadioGroup.Option value="all" className={styles.radioOption}>
          <span role="button" />
          <span>All including this month</span>
        </RadioGroup.Option>
      </RadioGroup>
      <div className={styles.deleteBillButtons}>
        <GrayButton onClick={onCancel}>
          <span>Cancel</span>
        </GrayButton>
        <DestructiveTextButton onClick={onSubmit}>
          <span>OK</span>
        </DestructiveTextButton>
      </div>
    </form>
  );
};

const EditBill = ({
  bill,
  onCancel,
  onUpdateSuccess,
}: {
  bill: TransformedBill;
  onCancel: () => void;
  onUpdateSuccess: () => void;
}) => {
  const [updateBill, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] =
    useUpdateBillsMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof billSchema>>({
    resolver: zodResolver(billSchema),
    defaultValues: { name: startCase(toLower(bill?.name)), emoji: bill?.emoji },
  });

  const [rangeMode, setRangeMode] = useState(Boolean(bill.lower_amount));

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // parse form data
    const reminders = extractReminders(e);

    handleSubmit((data) => {
      if (data.upper_amount || data.lower_amount) {
        updateBill({
          id: bill?.id,
          reminders: reminders,
          ...data,
        });
      } else {
        const payload = { id: bill?.id } as any;
        let k: keyof typeof data;
        for (k in data)
          if (data[k] !== (bill as any)?.[k]) payload[k] = data[k];
        updateBill(payload as UpdateBill);
      }
    })(e);
  };

  // Update success
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isUpdateSuccess) {
      timeout = setTimeout(() => {
        onUpdateSuccess();
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [isUpdateSuccess]);

  return (
    <form onSubmit={submitForm}>
      <input type="hidden" {...register('period')} value={bill.period} />
      <div className={styles.billEdit}>
        <h3>Edit Bill</h3>
        <hr />
        <div>
          <label htmlFor="schedule">Repeats</label>
          <BillScheduler
            defaultValue={{
              day: bill.day,
              week: bill.week,
              weekDay: bill.week_day,
              month: bill.month,
            }}
            billPeriod={bill.period}
            error={errors.schedule?.day}
            register={register}
          />
        </div>
        <div className={styles.emojiNameContainer}>
          <label htmlFor="emoji">Emoji</label>
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
        <div>
          <DollarRangeInput
            defaultLowerValue={bill.lower_amount}
            defaultUpperValue={bill.upper_amount}
            rangeMode={rangeMode}
            control={control}
            errors={errors}
          />
          <Checkbox
            label="Range"
            id="range"
            aria-label="Change bill amount to a range."
            checked={rangeMode}
            setChecked={setRangeMode}
          />
        </div>
        <div className={styles.splitInputs}>
          <div>
            <label htmlFor="expires">Expires</label>
            <Controller
              name="expires"
              control={control}
              render={(props) => (
                <DatePicker
                  disabled={[[undefined, dayjs().subtract(1, 'day')]]}
                  placeholder="Expires"
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
            <label htmlFor="reminders">Reminders</label>
            <AddReminder control={control} name="reminders" />
          </div>
        </div>
        <SubmitForm
          text="Save"
          submitting={isUpdating}
          success={isUpdateSuccess}
          onCancel={onCancel}
        />
      </div>
    </form>
  );
};

interface ModalContentProps {
  bill: TransformedBill;
  onClose: () => void;
}

export const BillModalContent = (props: ModalContentProps) => {
  const id = useId();
  const loaded = useLoaded(100);
  const [action, setAction] = useState<Action>('none');

  return (
    <div className={styles.billModalContent}>
      <Actions setAction={setAction} />
      <AnimatePresence mode="wait">
        {action === 'none' && (
          <SlideMotionDiv position={loaded ? 'first' : 'fixed'} key={id}>
            <BillInfo bill={props.bill} />
          </SlideMotionDiv>
        )}
        {action === 'edit' && (
          <SlideMotionDiv position={'last'} key={`${id}1`}>
            <EditBill
              bill={props.bill}
              onCancel={() => {
                setAction('none');
              }}
              onUpdateSuccess={() => {
                props.onClose();
              }}
            />
          </SlideMotionDiv>
        )}
        {action === 'delete' && (
          <SlideMotionDiv position={'last'} key={`${id}2`}>
            <DeleteBill
              bill={props.bill}
              onCancel={() => {
                setAction('none');
              }}
              onDelete={() => {
                props.onClose();
              }}
            />
          </SlideMotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

const BillModal = withModal<ModalContentProps>((props) => {
  return (
    <BillModalContent
      bill={props.bill}
      onClose={() => {
        props.closeModal();
        props.onClose && props.onClose();
      }}
    />
  );
});

export default function (props: ModalContentProps) {
  return <BillModal maxWidth="25em" {...props} />;
}
