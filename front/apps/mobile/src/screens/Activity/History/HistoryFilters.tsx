import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';

import styles from './styles/history';
import {
  Text,
  Button,
  MoneyInput,
  DatePicker,
  ModalPicker,
  InstitutionLogo,
  Box,
} from '@ledget/native-ui';
import {
  useGetAccountsQuery,
  selectConfirmedTransactionFilter,
  setConfirmedTransactionFilter,
  clearConfirmedTransactionFilter,
} from '@ledget/shared-features';
import { useAppearance } from '@features/appearanceSlice';
import { BillCatSelect } from '@components';
import { useAppSelector, useAppDispatch } from '@hooks';

const schema = z.object({
  date_range: z.array(z.number()).optional(),
  amount: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
  items: z.array(z.string()).optional(),
  accounts: z.array(z.string()).optional(),
});

const HistoryFilters = ({
  showFilters,
}: {
  showFilters: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectConfirmedTransactionFilter);

  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: filter,
  });
  const { mode } = useAppearance();
  const { data: accountsData } = useGetAccountsQuery();

  const onSubmit = () => {
    handleSubmit((data) => {
      showFilters(false);
      const { amount, ...rest } = data;
      const filter = {
        limit_amount_lower: amount?.min,
        limit_amount_upper: amount?.max,
        ...rest,
      };
      dispatch(setConfirmedTransactionFilter(filter));
    })();
  };

  return (
    <View style={styles.filtersForm}>
      <Controller
        control={control}
        name="date_range"
        render={({ field: { onChange, value } }) => (
          <DatePicker
            pickerType="range"
            mode="date"
            format="MM/DD/YYYY"
            label="Date"
            theme={mode === 'dark' ? 'dark' : 'light'}
            disabled={[
              [undefined, dayjs()],
              [undefined, dayjs()],
            ]}
            placeholder={['Start Date', 'End Date']}
            onChange={(value) => {
              const v = value?.map((i) => i?.valueOf());
              onChange(v);
            }}
          />
        )}
      />
      <Controller
        control={control}
        name="amount"
        render={({ field: { onChange, value } }) => (
          <MoneyInput
            inputType="range"
            label="Amount"
            onChange={onChange}
            accuracy={2}
          />
        )}
      />
      {/* <Controller
        control={control}
        name='items'
        render={({ field: { onChange, value } }) => (
          <BillCatSelect multiple onChange={onChange} label={'Categories and Bills'} />
        )}
      />
      <Controller
        control={control}
        name='accounts'
        render={({ field: { onChange, value } }) => (
          <ModalPicker
            header='Accounts'
            isFormInput={true}
            options={accountsData?.accounts}
            label='Accounts'
            onChange={onChange}
            labelKey='name'
            valueKey='account_id'
            renderSelected={(option, index) => (
              <View style={styles.accountOption}>
                <Text>{`${option.name}${index < (value?.length || 0) - 1 ? ', ' : ''}`}</Text>
              </View>
            )}
            renderOption={(option) => (
              <View style={styles.accountOption}>
                <InstitutionLogo account={option.id} />
                <Text>{option.name}</Text>
              </View>
            )}
            searchable
          />
        )}
      /> */}
      <Button variant="main" marginTop="l" label="Save" onPress={onSubmit} />
      <View style={styles.bottomButtons}>
        <Button
          label="Clear"
          textColor="blueText"
          onPress={() => dispatch(clearConfirmedTransactionFilter())}
        />
        <Box backgroundColor="menuSeperator" variant="divider" />
        <Button
          label="Cancel"
          textColor="blueText"
          onPress={() => showFilters(false)}
        />
      </View>
    </View>
  );
};

export default HistoryFilters;
