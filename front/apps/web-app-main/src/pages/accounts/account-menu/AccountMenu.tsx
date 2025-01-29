import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ChevronDown } from '@geist-ui/icons';
import { useSpringRef, useTransition, animated, Any } from '@react-spring/web';
import Big from 'big.js';

import styles from './styles.module.scss';
import { InstitutionLogo } from '@components/pieces';
import {
  StyledMenu,
  DollarCents,
  FilterPillButton,
  GripButton,
} from '@ledget/ui';
import { useSpringDrag } from '@ledget/ui';
import {
  useGetAccountsQuery,
  Account,
  useUpdateAccountsMutation,
} from '@ledget/shared-features';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import pathMappings from '../path-mappings';
import {
  selectAccounts,
  setAccounts,
} from '@features/depositoryAccountsTabSlice';
import { capitalize } from '@ledget/helpers';

type SelectOption = {
  value: string;
  filterType: 'institution' | 'deposit-type' | 'meta';
  label: string;
  color?: string;
};

const AccountMenu = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data } = useGetAccountsQuery();
  const [updateOrder] = useUpdateAccountsMutation();

  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAccounts);
  const [accountsFilterOptions, setAccountsFilterOptions] =
    useState<SelectOption[]>();
  const [accountsFilter, setAccountsFilter] = useState<SelectOption>();
  const [menuListItems, setMenuListItems] = useState<Account[]>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const order = useRef<string[]>(
    data?.accounts
      .filter((a) => a.type === pathMappings.getAccountType(location))
      .map((a) => a.id) || []
  );
  const rowHeight = useMemo(
    () =>
      parseFloat(window.getComputedStyle(document.documentElement).fontSize) *
      4,
    []
  );

  const api = useSpringRef();
  const transitions = useTransition(menuListItems, {
    from: (_, i) => ({
      y: rowHeight * i,
      height: rowHeight,
      zIndex: menuListItems ? menuListItems.length - i : 0,
    }),
    update: (_, i) => ({
      y: rowHeight * i,
      zIndex: menuListItems ? menuListItems.length - i : 0,
    }),
    ref: api,
    config: {
      tension: 300,
      friction: 30,
      mass: 1,
    },
  });

  const bind = useSpringDrag({
    order: order,
    api: api,
    onRest: (newOrder) => {
      if (order.current !== newOrder) {
        updateOrder(
          newOrder.map((id, index) => ({
            account: id,
            order: index,
          }))
        );
      }
    },
    style: {
      padding: 0,
      size: rowHeight,
      axis: 'y',
    },
    activeScale: 1,
  });

  useEffect(() => {
    api.start();
  }, [menuListItems]);

  useEffect(() => {
    if (accounts) {
      searchParams.set('accounts', accounts.join(','));
      setSearchParams(searchParams);
    }
  }, [accounts]);

  // Update order when accounts change
  useEffect(() => {
    order.current =
      data?.accounts
        .filter((a) => a.type === pathMappings.getAccountType(location))
        .map((a) => a.id) || [];
  }, [data]);

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

  // Store accounts state in global state
  useEffect(() => {
    if (data && !accounts) {
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
        <div>
          <InstitutionLogo accountId={accounts?.[0]} size={'1.5em'} />
        </div>
        <span>{data?.accounts?.find((a) => a.id === accounts?.[0])?.name}</span>
        <span>
          <DollarCents
            value={Big(
              data?.accounts?.find((a) => a.id === accounts?.[0])?.balances
                .current || 0
            )
              .times(100)
              .toNumber()}
          />
        </span>
        <ChevronDown className="icon" strokeWidth={2} />
      </StyledMenu.Button>
      <StyledMenu.Items
        className={styles.dropdown}
        ref={scrollRef}
        onOpen={(open) => {
          if (open) {
            const currentIndex =
              menuListItems?.findIndex((m) => m.id === accounts?.[0]) || 0;
            scrollRef.current?.scrollTo({
              top: rowHeight * currentIndex,
              behavior: 'instant',
            });
          }
        }}
      >
        <div className={styles.filterButtonsContainer}>
          {/*Bottom Border */}
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
        {/* Scroll bar cover */}
        <span />
        <div className={styles.itemOptions}>
          {transitions(
            (style, a) =>
              a && (
                <animated.div
                  className={styles.accountMenuItem}
                  style={style}
                  {...bind(a.id)}
                >
                  <div>
                    {(!accountsFilter || accountsFilter.value === 'all') && (
                      <GripButton />
                    )}
                  </div>
                  <StyledMenu.Item
                    onClick={() => {
                      dispatch(setAccounts(a.id));
                    }}
                    renderLeft={() => (
                      <div
                        className={styles.optionLeftSide}
                        data-selected={accounts?.includes(a.id)}
                      >
                        <div>
                          <InstitutionLogo accountId={a.id} size={'1.5em'} />
                        </div>
                        <div>
                          <span>{capitalize(a.name)}</span>
                          <span>
                            &bull;&nbsp;&bull;&nbsp;{capitalize(a.mask)}
                          </span>
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
                </animated.div>
              )
          )}
        </div>
      </StyledMenu.Items>
    </StyledMenu>
  );
};

export default AccountMenu;
