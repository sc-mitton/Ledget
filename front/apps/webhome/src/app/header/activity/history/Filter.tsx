import { useEffect, useState } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useController, useWatch, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import styles from './styles/filter.module.scss';
import {
  useGetAccountsQuery,
  useGetMerchantsQuery,
  useLazyGetTransactionsQuery,
  selectConfirmedTransactionFilter,
  setConfirmedTransactionFilter,
  clearConfirmedTransactionFilter,
  useLazyGetCategoriesQuery
} from '@ledget/shared-features';
import { FullSelectCategoryBill } from '@components/inputs';
import { LimitAmountInput } from '@components/inputs';
import {
  BlueSlimButton,
  FormInputButton2,
  BakedListBox,
  BakedComboBox,
  SecondaryButtonSlim,
  DeleteButton,
  useColorScheme,
  DatePicker
} from '@ledget/ui';
import { useFilterFormContext } from '../context';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import { useGetStartEndQueryParams } from '@hooks/index';

const filterSchema = z.object({
  date_range: z.array(z.number()).optional(),
  limit_amount_lower: z.number().optional(),
  limit_amount_upper: z.number().optional(),
  items: z.array(z.string()).optional(),
  merchants: z.array(z.string()).optional(),
  accounts: z.array(z.string()).optional()
});

export type TransactionFilterSchema = z.infer<typeof filterSchema>;

export const FilterForm = () => {
  const { setShowFilterForm } = useFilterFormContext();
  const { data: accountsData } = useGetAccountsQuery();
  const { data: merchantsData } = useGetMerchantsQuery();
  const [getLazyTransactions] = useLazyGetTransactionsQuery();
  const { start, end } = useGetStartEndQueryParams();
  const filter = useAppSelector(selectConfirmedTransactionFilter);
  const dispatch = useAppDispatch();
  const [getCategories, { data: categoryData }] = useLazyGetCategoriesQuery();
  const { isDark } = useColorScheme();

  const { handleSubmit, control, reset, resetField } =
    useForm<TransactionFilterSchema>({
      resolver: zodResolver(filterSchema),
      mode: 'onSubmit',
      reValidateMode: 'onBlur',
      defaultValues: filter
    });

  const merchantsFieldValue = useWatch({ control, name: 'merchants' });
  const accountsFieldValue = useWatch({ control, name: 'accounts' });
  const dateRangeFieldValue = useWatch({ control, name: 'date_range' });
  const [resetKey, setResetKey] = useState(
    Math.random().toString(36).slice(2, 9)
  );
  const [resetAccountMerchantKeys, setResetAccountMerchantKeys] = useState([
    Math.random().toString(36).slice(2, 9),
    Math.random().toString(36).slice(2, 9)
  ]);

  useEffect(() => {
    const s = dateRangeFieldValue?.[0];
    const e = dateRangeFieldValue?.[1];
    getCategories({ start: s, end: e, spending: false }, true);
  }, [dateRangeFieldValue]);

  const { field } = useController({ name: 'date_range', control });

  return (
    <div className={styles.filterWindow}>
      <form
        className={`${isDark ? 'dark' : ''}`}
        key={resetKey}
        onSubmit={handleSubmit((data) => {
          const { date_range, ...rest } = data;
          dispatch(setConfirmedTransactionFilter(data));
          const newData = {
            ...rest,
            start: date_range?.[0],
            end: date_range?.[1],
            confirmed: true
          };
          getLazyTransactions(newData);
          setShowFilterForm(false);
        })}
      >
        <fieldset>
          <label htmlFor="date_range">Date</label>
          <DatePicker
            name="date_range"
            pickerType="range"
            placeholder={['Start', 'End']}
            defaultValue={
              filter?.date_range
                ? [
                    dayjs.unix(filter.date_range[0]),
                    dayjs.unix(filter.date_range[1])
                  ]
                : [dayjs.unix(start), dayjs.unix(end)]
            }
            onChange={(v) => {
              const newVal = [v?.[0].unix(), v?.[1].unix()];
              !newVal.every((v, i) => v === dateRangeFieldValue?.[i]) &&
                field.onChange(newVal);
            }}
          />
          <label htmlFor="limit_amount">Amount</label>
          <div className={styles.amounts}>
            <LimitAmountInput
              defaultValue={Number(filter?.limit_amount_lower)}
              slim={true}
              name="limit_amount_lower"
              hasLabel={false}
              withCents={false}
              control={control}
            />
            <LimitAmountInput
              defaultValue={Number(filter?.limit_amount_upper)}
              slim={true}
              name="limit_amount_upper"
              hasLabel={false}
              withCents={false}
              control={control}
            />
          </div>
          <div>
            <label htmlFor="category">Category or Bill</label>
          </div>
          <div>
            <FullSelectCategoryBill
              defaultValue={categoryData?.filter((cat) =>
                filter?.items?.includes(cat.id)
              )}
              month={
                new Date(
                  dateRangeFieldValue?.[1] || new Date().getTime()
                ).getMonth() + 1
              }
              year={new Date(
                dateRangeFieldValue?.[1] || new Date().getTime()
              ).getFullYear()}
              placeholder="Select"
              SelectorComponent={FormInputButton2}
              name="items"
              control={control}
              multiple={true}
            />
          </div>
          <div>
            <label htmlFor="merchant">Merchant</label>
            <label htmlFor="account">Account</label>
          </div>
          <div>
            <div key={resetAccountMerchantKeys[0]}>
              <BakedComboBox
                options={merchantsData}
                multiple={true}
                slim={true}
                name="merchants"
                control={control as any}
                defaultValue={filter?.merchants}
                placement={'left'}
                placeholder={'Select'}
                maxLength={24}
                style={{ marginTop: '.375em' }}
              />
            </div>
            <div key={resetAccountMerchantKeys[1]}>
              <BakedListBox
                defaultValue={accountsData?.accounts.filter((acc) =>
                  accountsFieldValue?.includes(acc.account_id)
                )}
                as={FormInputButton2}
                name="accounts"
                control={control as any}
                options={accountsData?.accounts}
                placement={'right'}
                placeholder={'Select'}
                multiple={true}
                labelKey={'name'}
                subLabelKey={'mask'}
                subLabelPrefix={'••••'}
                valueKey={'account_id'}
                dividerKey={'institution_id'}
                style={{ marginTop: '.25em' }}
                showLabel={false}
              />
            </div>
          </div>
          <div>
            {merchantsFieldValue?.map((merchant, index) => (
              <span>{`${merchant}${
                index !== merchantsFieldValue?.length - 1 ? ', ' : ''
              }`}</span>
            ))}
            {merchantsFieldValue && (
              <DeleteButton
                visible={true}
                animated={false}
                onClick={() => {
                  setResetAccountMerchantKeys((prev) => [
                    Math.random().toString(36).slice(2, 9),
                    prev[1]
                  ]);
                  resetField('merchants');
                }}
              />
            )}
          </div>
          <div>
            {accountsFieldValue?.map((account, index) => (
              <span>
                {
                  accountsData?.accounts?.find(
                    (acc: any) => acc.account_id === account
                  )?.name
                }
                {index !== accountsFieldValue?.length - 1 ? ', ' : ''}
              </span>
            ))}
            {(accountsFieldValue?.length as any) > 0 && (
              <DeleteButton
                visible={true}
                animated={false}
                onClick={() => {
                  setResetAccountMerchantKeys((prev) => [
                    prev[0],
                    Math.random().toString(36).slice(2, 9)
                  ]);
                  resetField('accounts');
                }}
              />
            )}
          </div>
        </fieldset>
        <div>
          <SecondaryButtonSlim
            type="button"
            onClick={() => {
              reset();
              setResetKey(Math.random().toString(36).slice(2, 9));
              dispatch(clearConfirmedTransactionFilter());
            }}
          >
            Clear
          </SecondaryButtonSlim>
          <div>
            <SecondaryButtonSlim
              type="button"
              onClick={() => {
                setShowFilterForm(false);
              }}
            >
              Cancel
            </SecondaryButtonSlim>
            <BlueSlimButton>Filter</BlueSlimButton>
          </div>
        </div>
      </form>
    </div>
  );
};
