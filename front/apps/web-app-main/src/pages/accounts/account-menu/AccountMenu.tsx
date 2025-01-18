import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ChevronDown } from '@geist-ui/icons';
import Big from 'big.js';

import styles from './styles.module.scss';
import { InstitutionLogo } from '@components/pieces';
import { StyledMenu, DollarCents, FilterPillButton } from '@ledget/ui';
import { useGetAccountsQuery, Account } from '@ledget/shared-features';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import pathMappings from '../path-mappings';
import { selectAccounts, setAccounts } from '@features/accountsPageSlice';
import { capitalize } from '@ledget/helpers';

type SelectOption = {
  value: string;
  filterType: 'institution' | 'deposit-type' | 'meta';
  label: string;
  color?: string;
};

const AccountMenu = () => {
  const { data } = useGetAccountsQuery();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAccounts);
  const [accountsFilterOptions, setAccountsFilterOptions] =
    useState<SelectOption[]>();
  const [accountsFilter, setAccountsFilter] = useState<SelectOption>();
  const [menuListItems, setMenuListItems] = useState<Account[]>();

  useEffect(() => {
    if (accounts) {
      searchParams.set('accounts', accounts.join(','));
      setSearchParams(searchParams);
    }
  }, [accounts]);

  // Set filter options
  useEffect(() => {
    if (data) {
      const totalOption = {
        value: 'all',
        filterType: 'meta',
        label: 'All Accounts',
      } as const;

      const depositTypes = data.accounts
        .filter(
          (account) => account.type === pathMappings.getAccountType(location)
        )
        .map((account) => ({
          value: account.subtype,
          filterType: 'deposit-type' as const,
          label: ['cd', 'hsa'].includes(account.subtype.toLowerCase())
            ? account.subtype.toUpperCase()
            : capitalize(account.subtype),
        }))
        .reduce((acc, opt) => {
          if (!acc.some((v) => v.value === opt.value)) {
            acc.push(opt);
          }
          return acc;
        }, [] as SelectOption[]);

      const institutionOptions = data.institutions
        .map((institution) => ({
          value: institution.id,
          filterType: 'institution' as const,
          label: institution.name || '',
          color: institution.primary_color,
        }))
        .filter((i) => data.accounts.find((a) => a.institution_id === i.value));

      setAccountsFilterOptions((prev) => [
        totalOption,
        ...(institutionOptions || []),
        ...(depositTypes.length > 1 ? depositTypes : []),
      ]);
    }
  }, [location.pathname, data]);

  // Set filter to first option on mount if not already set
  useEffect(() => {
    if (accountsFilterOptions && !accountsFilter) {
      setAccountsFilter(accountsFilterOptions[0]);
    }
  }, [accountsFilterOptions]);

  useEffect(() => {
    if (data) {
      const pageAccountType = pathMappings.getAccountType(location);
      dispatch(
        setAccounts(data.accounts?.find((a) => a.type === pageAccountType)?.id)
      );
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setMenuListItems(
        data.accounts
          .filter((a) => a.type === pathMappings.getAccountType(location))
          .filter((a) => {
            switch (accountsFilter?.filterType) {
              case 'institution':
                return a.institution_id === accountsFilter.value;
              case 'deposit-type':
                return a.subtype === accountsFilter.value;
              case 'meta':
              default:
                return true;
            }
          })
      );
    }
  }, [data, accountsFilter]);

  return (
    <StyledMenu>
      <StyledMenu.Button className={styles.button}>
        <InstitutionLogo accountId={accounts?.[0]} size={'1.5em'} />
        <span>{data?.accounts?.find((a) => a.id === accounts?.[0])?.name}</span>
        <span>
          <DollarCents
            value={
              data?.accounts?.find((a) => a.id === accounts?.[0])?.balances
                .current || 0
            }
          />
        </span>
        <ChevronDown className="icon" strokeWidth={2} />
      </StyledMenu.Button>
      <StyledMenu.Items>
        <div className={styles.filterButtonsContainer}>
          <span />
          <div>
            {accountsFilterOptions?.map((option, i) => {
              return (
                <div>
                  {option.filterType !==
                    accountsFilterOptions[i - 1]?.filterType &&
                    i !== 0 && <span className={styles.divider} />}
                  <FilterPillButton
                    key={`fiter-button-${i}`}
                    selected={option.value === accountsFilter?.value}
                    onClick={() => {
                      setAccountsFilter(option);
                    }}
                  >
                    {option.color && (
                      <span
                        className={styles.dot}
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    {option.label}
                  </FilterPillButton>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.itemOptions}>
          {menuListItems?.map((a) => (
            <StyledMenu.Item
              onClick={() => {
                dispatch(setAccounts(a.id));
              }}
              renderLeft={() => (
                <div
                  className={styles.optionLeftSide}
                  data-selected={accounts?.includes(a.id)}
                >
                  <InstitutionLogo accountId={a.id} />
                  <div>
                    <span>{capitalize(a.name)}</span>
                    <span>&bull;&nbsp;&bull;&nbsp;{capitalize(a.mask)}</span>
                  </div>
                </div>
              )}
              renderRight={() => (
                <div
                  className={styles.rightSide}
                  data-selected={accounts?.includes(a.id)}
                >
                  <DollarCents
                    value={Big(a.balances.current || 0)
                      .times(100)
                      .toNumber()}
                  />
                </div>
              )}
            />
          ))}
        </div>
      </StyledMenu.Items>
    </StyledMenu>
  );
};

export default AccountMenu;
