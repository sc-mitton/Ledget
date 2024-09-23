import { useState, useMemo, useEffect } from 'react';
import { View } from 'react-native';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, { StretchOutY, SlideInLeft } from 'react-native-reanimated';
import { z } from 'zod';
import Big from 'big.js';

import styles from './styles/screen';
import { ModalScreenProps } from '@types';
import { useAppSelector } from '@hooks';
import {
  selectBudgetMonthYear,
  useConfirmTransactionsMutation,
  useGetCategoriesQuery
} from '@ledget/shared-features';
import {
  DollarCents,
  MoneyInput,
  Button,
  Icon,
  SwipeDelete,
  Modal,
  Seperator,
  Box,
  Text,
  Header2,
  FormError,
  SubmitButton
} from '@ledget/native-ui';
import { BillCatSelect } from '@/components';
import { Plus } from 'geist-native-icons';
import { useLoaded, formatCurrency } from '@ledget/helpers';

const schema = z.object({
  splits: z.array(
    z.object({
      category: z.string().min(1, { message: 'required' }),
      amount: z.number().min(0, { message: 'required' })
    })
  )
});

type SplitsSchemaT = z.infer<typeof schema>;

function getTotal(splits: SplitsSchemaT['splits']) {
  return splits
    .reduce(
      (acc, split) => acc.add(`${split.amount}`.replace(/\D+/g, '')),
      Big(0)
    )
    .toNumber();
}

const Screen = (props: ModalScreenProps<'Split'>) => {
  const loaded = useLoaded(1000);
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const item = useMemo(() => props.route.params.transaction, [props.route.params.transaction]);
  const [confirmTransactions, { isSuccess: isConfirmSuccess, isLoading: isConfirming }] = useConfirmTransactionsMutation();
  const [totalLeft, setTotalLeft] = useState(0);

  const { data: categoriesData } = useGetCategoriesQuery({
    month,
    year,
    spending: false
  });

  useEffect(() => {
    if (isConfirmSuccess) {
      props.navigation.goBack();
    }
  }, [isConfirmSuccess]);

  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    getValues,
    control
  } = useForm<SplitsSchemaT>({
    mode: 'onSubmit',
    resolver: zodResolver(
      schema.refine((data) => {
        const totalAmount = data.splits.reduce((acc, split) => acc + split.amount, 0);
        return Math.abs(totalAmount - item.amount * 100) === 0;
      }, {
        message: `Make sure everything adds up to ${formatCurrency(item.amount)}`,
        path: ['totalSum']
      })),
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

  const onSubmit = (data: SplitsSchemaT) => {
    // Only submit if any of the data is dirty
    if (Object.keys(dirtyFields).length > 0) {
      confirmTransactions([{
        transaction_id: item.transaction_id,
        splits: data.splits.map((split) => ({
          category: split.category,
          fraction: Big(split.amount).div(item.amount).div(100).round(2).toNumber()
        }))
      }])
    };
  };

  return (
    <Modal>
      <Box
        shadowColor='tabsShadow'
        shadowOpacity={.7}
        shadowRadius={4}
        shadowOffset={{ width: 0, height: 4 }}
        style={styles.header}
      >
        <Header2>Split Transaction</Header2>
        <Text>
          <Text color='quaternaryText'>Name        </Text>
          <Text color='secondaryText'>
            {props.route.params.transaction.preferred_name
              ? props.route.params.transaction.preferred_name.length > 25
                ? props.route.params.transaction.preferred_name.slice(0, 25) + '...'
                : props.route.params.transaction.preferred_name
              : props.route.params.transaction.name.length > 25
                ? props.route.params.transaction.name.slice(0, 25) + '...'
                : props.route.params.transaction.name}
          </Text>
        </Text>
        <Text>
          <Text color='quaternaryText'>Amount    </Text>
          <DollarCents
            color='secondaryText'
            value={props.route.params.transaction.amount}
            fontSize={18}
          />
        </Text>
        {Object.keys(dirtyFields).length > 0 && totalLeft !== 0 && (
          <Text>
            <Text color={totalLeft < 0 ? 'alert' : 'quaternaryText'}>
              Left&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Text>
            <DollarCents
              color={totalLeft < 0 ? 'alert' : 'secondaryText'}
              value={totalLeft}
              fontSize={18}
            />
          </Text>
        )}
        <Seperator variant='m' backgroundColor='modalSeperator' />
      </Box>
      <FormError error={(errors as any).totalSum?.message} />
      <View>
        {fields.map((field, index) => (
          <SwipeDelete
            disabled={index === 0}
            key={field.id}
            onDeleted={() => { setTimeout(() => { remove(index) }, 200) }}
          >
            <Animated.View
              key={field.id}
              style={styles.field}
              entering={SlideInLeft.withInitialValues({ originX: loaded ? -200 : 0 })}
              exiting={StretchOutY}
            >
              <View style={styles.categoryInput}>
                <Controller
                  control={control}
                  name={`splits.${index}.category`}
                  render={({ field }) => (
                    <BillCatSelect
                      closeOnSelect
                      multiple={false}
                      defaultValue={field.value}
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
                      style={{ paddingVertical: getValues().splits[index].category ? 3 : .5 }}
                      defaultValue={field.value}
                      onChange={(v) => {
                        field.onChange(Big(v || 0).times(100).toNumber());
                        setTotalLeft(
                          Big(item.amount).times(100).minus(getTotal(getValues().splits)).toNumber())
                      }}
                      inputType='single'
                      error={errors.splits?.[index]?.amount}
                      accuracy={2}
                    />
                  )}
                />
              </View>
            </Animated.View>
          </SwipeDelete>
        ))}
        {fields.length < 4 &&
          <View style={styles.addSplitButton}>
            <Button
              label='Add Split'
              variant='main'
              backgroundColor='transparent'
              textColor='quaternaryText'
              onPress={() => append({ category: '', amount: 0 })}
            >
              <Icon icon={Plus} color='quaternaryText' size={16} strokeWidth={2} />
            </Button>
          </View>}
        <SubmitButton
          isSubmitting={isConfirming}
          style={styles.saveButton}
          label='Save'
          variant='main'
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </Modal>
  )
}

export default Screen;
