import { useState, useEffect } from 'react';

import styles from './styles';
import { useAppSelector } from '@hooks';
import {
  selectBudgetMonthYear,
  useLazyGetBillsQuery,
  useLazyGetCategoriesQuery,
  Category,
  TransformedBill
} from '@ledget/shared-features';
import {
  TextInputbase,
  BillCatLabel,
  Text,
  Icon,
  Modal,
  ModalPicker
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
}

export const BillCatSelect = (props: BillCatSelectProps) => {
  const { items = 'all', label = true } = props;

  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const [getCategories, { data: categoryData }] = useLazyGetCategoriesQuery();
  const [getBills, { data: billData }] = useLazyGetBillsQuery();

  const [value, setValue] = useState<Option[] | Option>(
    [] as Option[] | Option);
  const [billCats, setBillCats] = useState<Option[]>([] as Option[]);
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);

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
        value: item.id
      })));
    }
  }, [categoryData, billData]);

  useEffect(() => {
    if (props.multiple) {
      props.onChange && props.onChange((value as Option[]).map(item => item.value))
    } else {
      props.onChange && props.onChange((value as Option).value)
    }
  }, [value]);

  return (
    <ModalPicker
      searchable
      options={billCats}
      multiple={props.multiple}
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
