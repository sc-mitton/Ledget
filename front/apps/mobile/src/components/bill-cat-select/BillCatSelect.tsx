import { useState, useEffect } from 'react';

import styles from './styles';
import { View } from 'react-native';
import { useAppSelector } from '@hooks';
import {
  selectBudgetMonthYear,
  useLazyGetBillsQuery,
  useLazyGetCategoriesQuery,
  isCategory
} from '@ledget/shared-features';
import {
  BillCatEmoji,
  BillCatLabel,
  Text,
  ModalPicker
} from '@ledget/native-ui';

type Error = {
  message?: string,
  type?: string
}

interface Option {
  label: string;
  value: string;
  emoji?: string | null;
  period: 'month' | 'year' | 'once';
  group: 'category' | 'bill';
}

interface BillCatSelectPropsBase {
  isFormInput?: boolean;
  items?: 'bills' | 'categories' | 'all';
  error?: Error;
  label?: string;
  modalPickerHeader?: string;
};

type BillCatSelectProps<M extends boolean = false> =
  M extends true
  ? {
    multiple?: M;
    onChange?: (value?: Option[]) => void
    defaultValue?: Option[]
    onClose?: (value?: Option[]) => void
  } & BillCatSelectPropsBase
  : {
    multiple?: M;
    onChange?: (value?: Option) => void
    defaultValue?: Option
    onClose?: (value?: Option) => void
  } & BillCatSelectPropsBase;


export const BillCatSelect = <TMultiple extends boolean>(props: BillCatSelectProps<TMultiple>) => {
  const {
    modalPickerHeader,
    onClose,
    items = 'all',
    label = '',
    isFormInput = true,
    multiple = false,
    defaultValue
  } = props;

  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const [getCategories, { data: categoryData }] = useLazyGetCategoriesQuery();
  const [getBills, { data: billData }] = useLazyGetBillsQuery();

  const [value, setValue] = useState(props.defaultValue);
  const [billCats, setBillCats] = useState<Option[]>([] as Option[]);

  useEffect(() => {
    getCategories({ month, year, spending: false }, true);
    getBills({ month, year }, true);
  }, []);

  useEffect(() => {
    if (categoryData && billData) {
      const allBillCats = items === 'all'
        ? [...categoryData, ...billData]
        : items === 'bills'
          ? billData
          : categoryData;
      setBillCats(allBillCats.map(item => ({
        label: item.name,
        value: item.id,
        emoji: item.emoji,
        period: item.period,
        group: isCategory(item) ? 'category' : 'bill'
      })));
    }
  }, [categoryData, billData]);

  useEffect(() => {
    if (!value) return;
    props.onChange && props.onChange(value as any);
  }, [value]);

  return (
    <ModalPicker
      searchable
      isFormInput={isFormInput}
      options={billCats}
      onClose={onClose as any}
      defaultValue={defaultValue as any}
      multiple={multiple}
      onChange={setValue}
      renderSelected={(option) => (
        <View style={styles.selectedOption}>
          <BillCatLabel
            name={option.label}
            emoji={option.emoji}
            period={option.period}
          />
        </View>
      )}
      renderOption={(option, _, selected) => (
        <View style={styles.option}>
          <BillCatEmoji
            emoji={option.emoji}
            period={option.period}
          />
          <Text>{option.label}</Text>
        </View>
      )}
      header={modalPickerHeader
        ? modalPickerHeader
        : items === 'all'
          ? props.multiple ? 'Categories and Bills' : 'Category or Bill'
          : items === 'bills' ? 'Bills' : 'Categories'}
      label={label
        ? label
        : items === 'all'
          ? props.multiple ? 'Categories and Bills' : 'Category or Bill'
          : items === 'bills' ? 'Bills' : 'Categories'}
      error={props.error}
    />
  )
}
