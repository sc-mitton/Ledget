import { useEffect } from 'react';

import { useForm, useFieldArray, Control, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Big from 'big.js'

import { SubmitForm } from '@components/pieces'
import { Transaction, useConfirmTransactionsMutation } from '@features/transactionsSlice'
import { useGetCategoriesQuery } from '@features/categorySlice';
import { InputButton } from '@ledget/ui'
import { LimitAmountInput } from '@components/inputs'
import { FullSelectCategoryBill } from '@components/dropdowns'
import { FormErrorTip, AnimatedDollarCents, DeleteButton, PlusPill } from '@ledget/ui'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'
import './split.scss';


const schema = z.object({
  splits: z.array(z.object({
    category: z.string().min(1, { message: 'required' }),
    amount: z.string().min(1, { message: 'required' })
      .refine((v) => v !== '0', { message: 'required' })
      .transform((value) => value.replace(/\D+/g, ''))
  }))
})

type SplitsSchema = z.infer<typeof schema>

function getTotal(splits: SplitsSchema['splits']) {
  return splits.reduce((acc, split) =>
    acc.add(`${split.amount}`.replace(/\D+/g, '')), Big(0)).toNumber()
}

const TotalLeft = ({ control, amount, error }: { control: Control<SplitsSchema>, amount: number, error: boolean }) => {
  const splitValues = useWatch({ control, name: 'splits' })

  const total = getTotal(splitValues)
  const remaining = Big(Math.abs(amount)).minus(total).toNumber()

  return (
    <>
      {remaining !== 0 &&
        <div className={`total-left--container
            ${error ? 'has-error' : ''}
             ${remaining > 0 ? 'has-remaining' : remaining === 0 ? 'is-even' : 'is-over'}`}
        >
          <AnimatedDollarCents value={remaining} />
          <span>{remaining > 0 ? 'left' : remaining === 0 ? '' : 'over'}</span>
        </div>}
    </>
  )
}

export function SplitTransactionInput({ item, onCancel }: { item: Transaction, onCancel: () => void }) {
  const [confirmTransactions, { isSuccess: isUpdateSuccess, isLoading: isUpdating }] = useConfirmTransactionsMutation()
  const { start, end } = useGetStartEndQueryParams(
    new Date(item.datetime).getMonth() + 1,
    new Date(item.datetime).getFullYear()
  )
  const { data: categoriesData } = useGetCategoriesQuery({ start, end, spending: false })

  const { handleSubmit, formState: { errors }, control } = useForm<SplitsSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(schema.refine((data) => {
      const totalAmount = data.splits.reduce((acc, split) => acc + parseFloat(split.amount), 0);
      return Math.abs(totalAmount - item.amount * 100) === 0
    }, { message: 'All of the dollar amounts must add up to the total', path: ['totalSum'] })),
    reValidateMode: 'onBlur',
    defaultValues: {
      splits: item.categories?.length
        ? item.categories.map((c) => ({ category: c.id, amount: Big(item.amount).times(c.fraction || 1).toFixed(2) }))
        : [{
          category: item.predicted_category?.id || (categoriesData ? categoriesData.find(c => c.is_default)?.id || '' : ''),
          amount: `${item.amount}`
        }]
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'splits' })

  const onSubmit = (data: SplitsSchema) => {
    confirmTransactions([{
      transaction_id: item.transaction_id,
      splits: data.splits.map((split) => ({
        category: split.category,
        fraction: Math.round(parseFloat(split.amount) / item.amount) / 100
      }))
    }])
  }

  useEffect(() => {
    isUpdateSuccess && onCancel()
  }, [isUpdateSuccess])

  return (
    <div>
      <form id="split-transaction--form" onSubmit={handleSubmit(onSubmit)}>
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
                SelectorComponent={InputButton}
                month={new Date(item.datetime).getMonth() + 1}
                year={new Date(item.datetime).getFullYear()}
                defaultValue={categoriesData?.find((c) => c.id === field.category)}
                control={control}
                name={`splits.${index}.category`}
              >
                <FormErrorTip errors={[(errors as any).splits?.[index]?.category]} />
              </FullSelectCategoryBill>
              <LimitAmountInput
                hasLabel={false}
                control={control}
                name={`splits.${index}.amount`}
                defaultValue={
                  Number(field.amount.replace(/\D+/g, ''))
                }
              >
                <FormErrorTip errors={[(errors as any).splits?.[index]?.amount]} />
              </LimitAmountInput>
              <div>
                {fields.length > 1 &&
                  <DeleteButton
                    fill={'var(--input-background)'}
                    stroke={'var(--m-text)'}
                    styled='input'
                    show={true}
                    type='button'
                    onClick={() => remove(index)}
                  />}
                {index === fields.length - 1 &&
                  <PlusPill
                    styled='input'
                    type='button'
                    onClick={() => append({ category: '', amount: '0' })}
                  />}
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
  )
}

export default SplitTransactionInput;
