import { useState, useEffect, FC, forwardRef } from 'react';

import styles from './styles/sort.module.scss';
import { IconButtonHalfGray, BakedListBox } from '@ledget/ui';
import { Filter2 } from '@ledget/media';
import { useSortContext } from './context';

const Button = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>((props, ref) => (
  <IconButtonHalfGray ref={ref} {...props}>
    <Filter2 />
    {props.children}
  </IconButtonHalfGray>
));

const billsOptions = [
  { id: 1, value: 'alpha-des', label: 'A-Z', disabled: false, default: false },
  { id: 2, value: 'alpha-asc', label: 'Z-A', disabled: false, default: false },
  {
    id: 5,
    value: 'amount-asc',
    label: 'Amount:  Low to High',
    disabled: false,
    default: false,
  },
  {
    id: 6,
    value: 'amount-des',
    label: 'Amount:  High to Low',
    disabled: false,
    default: false,
  },
];

const categoriesOptions = [
  { id: 1, value: 'alpha-des', label: 'A-Z', disabled: false, default: false },
  { id: 2, value: 'alpha-asc', label: 'Z-A', disabled: false, default: false },
  {
    id: 3,
    value: 'limit-asc',
    label: 'Limit:  Low to High',
    disabled: false,
    default: false,
  },
  {
    id: 4,
    value: 'limit-des',
    label: 'Limit:  High to Low',
    disabled: false,
    default: false,
  },
  {
    id: 5,
    value: 'amount-asc',
    label: 'Spent:  Low to High',
    disabled: false,
    default: false,
  },
  {
    id: 6,
    value: 'amount-des',
    label: 'Spent:  High to Low',
    disabled: false,
    default: false,
  },
];

const SortBills = ({ type }: { type: 'bills' | 'categories' }) => {
  const { billsSort, setBillsSort, categoriesSort, setCategoriesSort } =
    useSortContext();

  return (
    <div className={styles.sort} data-selected={Boolean(billsSort)}>
      <BakedListBox
        hideSelectedLabel={true}
        as={Button}
        value={type === 'bills' ? billsSort : categoriesSort}
        onChange={type === 'bills' ? setBillsSort : setCategoriesSort}
        placement="right"
        options={type === 'bills' ? billsOptions : categoriesOptions}
      />
    </div>
  );
};

export default SortBills;
