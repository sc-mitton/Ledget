import { useState, useEffect } from 'react';
import { Check } from 'geist-native-icons';

import styles from './styles';
import { View } from 'react-native';
import { useAppSelector } from '@hooks';
import {
  selectBudgetMonthYear,
  useLazyGetBillsQuery,
  useLazyGetCategoriesQuery,
} from '@ledget/shared-features';
import {
  BillCatEmoji,
  BillCatLabel,
  Text,
  ModalPicker,
  Icon,
} from '@ledget/native-ui';

type Error = {
  message?: string,
  type?: string
}

interface BillCatSelectProps {
  items?: 'bills' | 'categories' | 'all';
  onChange: (value: string[] | string) => void
  multiple?: boolean;
  error?: Error;
  label?: boolean;
};

interface Option {
  label: string;
  value: string;
  emoji?: string | null;
  period: 'month' | 'year' | 'once';
}

export const BillCatSelect = (props: BillCatSelectProps) => {
  const { items = 'all', label = true } = props;

  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const [getCategories, { data: categoryData }] = useLazyGetCategoriesQuery();
  const [getBills, { data: billData }] = useLazyGetBillsQuery();

  const [value, setValue] = useState<string[] | string>(
    [] as string[] | string);
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
        period: item.period
      })));
    }
  }, [categoryData, billData]);

  useEffect(() => {
    if (!value) return;
    props.onChange && props.onChange(value);
  }, [value]);

  return (
    <ModalPicker
      searchable
      options={billCats}
      multiple={props.multiple ? true : false}
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
      header={items === 'all'
        ? props.multiple ? 'Categories and Bills' : 'Category or Bill'
        : items === 'bills' ? 'Bills' : 'Categories'}
      label={items === 'all'
        ? props.multiple ? 'Categories and Bills' : 'Category or Bill'
        : items === 'bills' ? 'Bills' : 'Categories'}
      error={props.error}
    />
  )
}
