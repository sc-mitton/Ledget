import { useEffect, useState } from 'react';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition, animated } from '@react-spring/web';
import { Edit } from '@geist-ui/icons';

import styles from './styles/add-bills.module.scss';
import {
  useUpdateUserMutation,
  useGetRecurringTransactionsQuery,
  useAddnewBillMutation,
  Bill,
  useTransactionsSyncMutation,
} from '@ledget/shared-features';
import {
  NestedWindow,
  LoadingRingDiv,
  DollarCents,
  Checkbox,
  TextButton,
  TextButtonBlue,
  BlueSubmitButton,
} from '@ledget/ui';
import { getScheduleDescription } from '@utils/helpers';

const formSchema = z.object({
  bills: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      upper_amount: z.number(),
      day: z.coerce.number().min(1).max(31).optional(),
      week: z.coerce.number().min(1).max(5).optional(),
      week_day: z.coerce.number().min(1).max(7).optional(),
      month: z.coerce.number().min(1).max(12).optional(),
    })
  ),
});

type FormSchemaT = z.infer<typeof formSchema>;

const AddBills = () => {
  const [updateUser] = useUpdateUserMutation();
  const [addNewBill, { isLoading, isSuccess }] = useAddnewBillMutation();
  const [
    syncTransactions,
    { isLoading: isSyncingTransactions, isSuccess: hasSyncedTransactions },
  ] = useTransactionsSyncMutation();
  const {
    data: recurringTransactions,
    isLoading: isLoadingRecurringTransactions,
  } = useGetRecurringTransactionsQuery(undefined, {
    skip: !hasSyncedTransactions,
  });

  const [listOptions, setListOptions] = useState<Bill[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bills',
  });

  const transitions = useTransition(listOptions, {
    from: { opacity: 0 },
    enter: { opacity: 1, maxHeight: '200px' },
    leave: { opacity: 0, maxHeight: 0 },
  });

  useEffect(() => {
    syncTransactions();
  }, []);

  useEffect(() => {
    if (recurringTransactions) {
      setListOptions(
        recurringTransactions.map((t, index) => ({ ...t, id: index } as any))
      );
    }
  }, [recurringTransactions]);

  const onSubmit = (data: FormSchemaT) => {
    console.log(data);
  };

  return (
    <div>
      <div className={styles.header}>
        <h2>Add Bills</h2>
      </div>
      <h4>Confirm any of your recurring payments, or enter them manually.</h4>
      <hr />
      <LoadingRingDiv
        className={styles.loadingRingDiv}
        loading={isSyncingTransactions || isLoadingRecurringTransactions}
      >
        <div className={styles.recurringTransactions}>
          {transitions((style, item, _, index) => (
            <animated.div style={style} className={styles.billItem}>
              <Checkbox
                id={`checkbox-${index}`}
                checked={fields.some((f) => f.id === item.id)}
                setChecked={() => {
                  if (fields.some((f) => f.id === item.id)) {
                    remove(index);
                  } else {
                    append({
                      id: item.id,
                      name: item.name,
                      upper_amount: item.upper_amount,
                      day: item.day,
                      week: item.week,
                      week_day: item.week_day,
                      month: item.month,
                    });
                  }
                }}
              />
              <div>
                <h3>{item?.name}</h3>
                <span>{getScheduleDescription(item)}</span>
              </div>
              <div>
                <DollarCents value={item?.upper_amount || 0} />
              </div>
            </animated.div>
          ))}
        </div>
      </LoadingRingDiv>
      <div className={styles.bottomButtons}>
        <TextButton className={styles.customButton}>
          <div>
            Custom <Edit className="icon" />
          </div>
        </TextButton>
        <BlueSubmitButton onSubmit={handleSubmit(onSubmit)}>
          Continue
        </BlueSubmitButton>
      </div>
    </div>
  );
};

export default AddBills;
