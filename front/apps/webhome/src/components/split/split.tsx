import { useEffect } from 'react';

import { useForm, useFieldArray, Control, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Big from 'big.js';

import { useAppSelector } from '@hooks/store';
import {
  selectBudgetMonthYear,
  Transaction,
  useConfirmTransactionsMutation,
  useGetCategoriesQuery
} from '@ledget/shared-features';
import { SubmitForm } from '@components/pieces';
import { FormInputButton } from '@ledget/ui';
import { LimitAmountInput } from '@components/inputs';
import { FullSelectCategoryBill } from '@components/inputs';
import {
  FormErrorTip,
  AnimatedDollarCents,
  DeleteButton,
  PlusButton
} from '@ledget/ui';
import styles from './split.module.scss';

const schema = z.object({
  splits: z.array(
    z.object({
      category: z.string().min(1, { message: 'required' }),
      amount: z.number().min(1, { message: 'required' })
    })
  )
});

type SplitsSchema = z.infer<typeof schema>;

function getTotal(splits: SplitsSchema['splits']) {
  return splits
    .reduce(
      (acc, split) => acc.add(`${split.amount}`.replace(/\D+/g, '')),
      Big(0)
    )
    .toNumber();
}

const TotalLeft = ({
  control,
  amount,
  error
}: {
  control: Control<SplitsSchema>;
  amount: number;
  error: boolean;
}) => {
  const splitValues = useWatch({ control, name: 'splits' });

  const total = getTotal(splitValues);
  const remaining = Big(Math.abs(amount)).minus(total).toNumber();

  return (
    <>
      {remaining !== 0 && (
        <div
          className={styles.totalLeftContainer}
          data-error={Boolean(error)}
          data-status={
            remaining > 0 ? 'remaining' : remaining === 0 ? 'even' : 'over'
          }
        >
          <AnimatedDollarCents value={remaining} />
          <span>{remaining > 0 ? 'left' : remaining === 0 ? '' : 'over'}</span>
        </div>
      )}
    </>
  );
};

export function SplitTransactionInput({
  item,
  onCancel
}: {
  item: Transaction;
  onCancel: () => void;
}) {
  const [
    confirmTransactions,
    { isSuccess: isUpdateSuccess, isLoading: isUpdating }
  ] = useConfirmTransactionsMutation();
  const { month, year } = useAppSelector(selectBudgetMonthYear);

  const { data: categoriesData } = useGetCategoriesQuery({
    month,
    year,
    spending: false
  });

  const {
    handleSubmit,
    formState: { errors },
    control
  } = useForm<SplitsSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(
      schema.refine(
        (data) => {
          const totalAmount = data.splits.reduce(
            (acc, split) => acc + split.amount,
            0
          );
          return Math.abs(totalAmount - item.amount * 100) === 0;
        },
        {
          message: 'All of the dollar amounts must add up to the total',
          path: ['totalSum']
        }
      )
    ),
    reValidateMode: 'onBlur',
    defaultValues: {
      splits: item.categories?.length
        ? item.categories.map((c) => ({
            category: c.id,
            amount: Big(item.amount)
              .times(c.fraction || 1)
              .times(100)
              .toNumber()
          }))
        : [
            {
              category:
                item.predicted_category?.id ||
                (categoriesData
                  ? categoriesData.find((c) => c.is_default)?.id || ''
                  : ''),
              amount: Big(item.amount).times(100).toNumber()
            }
          ]
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'splits' });

  const onSubmit = (data: SplitsSchema) => {
    confirmTransactions([
      {
        transaction_id: item.transaction_id,
        splits: data.splits.map((split) => ({
          category: split.category,
          fraction: Math.round(split.amount / item.amount) / 100
        }))
      }
    ]);
  };

  useEffect(() => {
    isUpdateSuccess && onCancel();
  }, [isUpdateSuccess]);

  return (
    <div>
      <form
        className={styles.splitTransactionForm}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TotalLeft
          control={control}
          amount={Big(item.amount).times(100).toNumber()}
          error={!!(errors as any).totalSum}
        />
        <div>
          {fields.map((field, index) => (
            <section key={field.id}>
              <FullSelectCategoryBill
                includeBills={false}
                SelectorComponent={FormInputButton}
                month={new Date(item.datetime).getMonth() + 1}
                year={new Date(item.datetime).getFullYear()}
                defaultValue={categoriesData?.find(
                  (c) => c.id === field.category
                )}
                control={control}
                name={`splits.${index}.category`}
              >
                <FormErrorTip
                  error={(errors as any).splits?.[index]?.category}
                />
              </FullSelectCategoryBill>
              <LimitAmountInput
                hasLabel={false}
                control={control}
                name={`splits.${index}.amount`}
                defaultValue={field.amount}
              >
                <FormErrorTip error={(errors as any).splits?.[index]?.amount} />
              </LimitAmountInput>
              <div>
                {fields.length > 1 && (
                  <DeleteButton
                    fill={'var(--input-background)'}
                    stroke={'var(--m-text)'}
                    visible={true}
                    type="button"
                    onClick={() => remove(index)}
                    size={'1.4em'}
                  />
                )}
                {index === fields.length - 1 && (
                  <PlusButton
                    type="button"
                    onClick={() => {
                      append({ category: '', amount: 0 });
                    }}
                  />
                )}
              </div>
            </section>
          ))}
        </div>
        <SubmitForm
          submitting={isUpdating}
          success={isUpdateSuccess}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
}

export default SplitTransactionInput;
