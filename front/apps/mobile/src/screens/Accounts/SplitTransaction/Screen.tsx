import { useMemo } from 'react';
import { View } from 'react-native';
import { useForm, useFieldArray, Control, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Big from 'big.js';

import styles from './styles/screen';
import { AccountsScreenProps } from '@types';
import { useAppSelector } from '@hooks';
import { selectBudgetMonthYear, useConfirmTransactionsMutation, useGetCategoriesQuery } from '@ledget/shared-features';
import { Box, Text, DollarCents, MoneyInput, Button, Icon, InputLabel } from '@ledget/native-ui';
import { BillCatSelect } from '@/components';
import { Plus } from 'geist-native-icons';

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

const Screen = (props: AccountsScreenProps<'Split'>) => {
  const item = useMemo(() => props.route.params.transaction, [props.route.params.transaction]);
  const [confirmTransactions, { isSuccess: isUpdateSuccess, isLoading: isUpdating }] = useConfirmTransactionsMutation();
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
      schema.refine((data) => {
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
      )),
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
        : [{
          category:
            item.predicted_category?.id ||
            (categoriesData
              ? categoriesData.find((c) => c.is_default)?.id || ''
              : ''),
          amount: Big(item.amount).times(100).toNumber()
        }]
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'splits' });

  const onSubmit = (data: SplitsSchema) => {
  };

  return (
    <Box variant='nestedScreen'>
      <View style={styles.header}>
        <DollarCents
          value={props.route.params.transaction.amount}
          fontSize={36} />
        <Text>
          {props.route.params.transaction.preferred_name || props.route.params.transaction.name}
        </Text>
      </View>
      <InputLabel style={styles.formLabel}>Splits</InputLabel>
      <View style={styles.form}>
        {fields.map((field, index) => (
          <View key={field.id} style={styles.field}>
            <View style={styles.categoryInput}>
              <Controller
                control={control}
                name={`splits.${index}.category`}
                render={({ field }) => (
                  <BillCatSelect
                    onChange={field.onChange}
                    label={''}
                    error={errors.splits?.[index]?.category}
                    items='categories'
                    chevronDirection='down'
                  />
                )}
              />
            </View>
            <View style={styles.amountInput}>
              <Controller
                control={control}
                name={`splits.${index}.amount`}
                render={({ field }) => (
                  <MoneyInput
                    onChange={(v) => field.onChange(v)}
                    inputType='single'
                    error={errors.splits?.[index]?.amount}
                  />
                )}
              />
            </View>
          </View>
        ))}
        <Button
          label='Add Split'
          variant='dashedMain'
          labelPlacement='left'
          onPress={() => append({ category: '', amount: 0 })}
        >
          <Icon icon={Plus} color='tertiaryText' />
        </Button>
        <View style={styles.submitButtonContainer}>
          <Button
            label='Save'
            variant='main'
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </Box>
  )
}
export default Screen
