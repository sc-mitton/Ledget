import React, { useState, useEffect, Fragment } from 'react';
import { ScrollView, View } from 'react-native';
import { LinearGradient, Rect, Canvas, vec } from '@shopify/react-native-skia';
import { useTheme } from '@shopify/restyle';

import styles from './styles/filters';
import { Button, Seperator, Box } from '@ledget/native-ui';
import { Account, useGetAccountsQuery } from '@ledget/shared-features';
import { ModalScreenProps } from '@types';
import { capitalize } from '@ledget/helpers';

interface Filter {
  label?: string;
  value: string;
  dotColor?: string;
  group: string;
}

interface FiltersP extends ModalScreenProps<'PickAccount'> {
  onChange: (selected?: Account[]) => void;
  onFiltered: (filtered: boolean) => void;
}

const Filters = (props: FiltersP) => {
  const { data } = useGetAccountsQuery();
  const theme = useTheme();

  const [filters, setFilters] = useState<Filter[]>([]);
  const [localAccounts, setLocalAccounts] = useState<Account[]>();
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);

  // Update the filters list when the accounts are fetched
  useEffect(() => {
    if (data) {
      const accounts = data.accounts.filter(
        (a) => a.type === props.route.params.accountType
      );

      const institutionFilters = data.institutions
        .filter((i) => accounts.some((a) => a.institution_id === i.id))
        .map((i) => ({
          label: i.name,
          value: i.id,
          group: 'institution',
          dotColor: i.primary_color,
        }));
      let subTypeFilters = accounts.map((a) => ({
        label: a.subtype,
        value: a.subtype,
        group: 'subType',
      }));
      subTypeFilters = subTypeFilters.filter(
        (filter, i) =>
          subTypeFilters.findIndex((f) => f.value === filter.value) === i
      );

      const filters = [
        ...(institutionFilters.length > 1 ? institutionFilters : []),
        ...(subTypeFilters.length > 1 ? subTypeFilters : []),
      ];
      const dedupedFilters = filters.filter(
        (filter, i) => filters.findIndex((f) => f.value === filter.value) === i
      );
      setFilters(dedupedFilters);
      setLocalAccounts(accounts);
    }
  }, [data]);

  // Update the accounts list when the order changes
  useEffect(() => {
    if (props.route.params.options?.order) {
      setLocalAccounts(
        [...(localAccounts || [])]?.sort((a, b) => {
          switch (props.route.params.options?.order) {
            case 'balance-asc':
              return a.balances.current - b.balances.current;
            case 'balance-desc':
              return b.balances.current - a.balances.current;
            case 'name-asc':
              return a.name.localeCompare(b.name);
            case 'name-desc':
              return b.name.localeCompare(a.name);
            default:
              return 0;
          }
        })
      );
    } else {
      setLocalAccounts(
        data?.accounts.filter((a) => a.type === props.route.params.accountType)
      );
    }
  }, [props.route.params.options?.order]);

  // Update the accounts list when the filters change
  useEffect(() => {
    if (selectedFilters?.length) {
      setLocalAccounts(
        data?.accounts.filter((a) =>
          selectedFilters.some(
            (f) => f.value === a.subtype || f.value === a.institution_id
          )
        )
      );
      props.onFiltered(true);
    } else {
      setLocalAccounts(
        data?.accounts.filter((a) => a.type === props.route.params.accountType)
      );
      props.onFiltered(false);
    }
  }, [selectedFilters]);

  // Call the onChange callback when the accounts list changes
  useEffect(() => {
    props.onChange(localAccounts);
  }, [localAccounts]);

  return (
    <>
      <View style={filters?.length ? styles.filters : undefined}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((filter, i) => (
            <Fragment key={`filter-${i}`}>
              {i !== 0 && filters[i - 1].group !== filter.group && (
                <Box
                  style={styles.groupDelimiter}
                  backgroundColor="borderedGrayButton"
                />
              )}
              <Button
                style={styles.filter}
                key={`filter-${i}`}
                variant={
                  selectedFilters.includes(filter)
                    ? 'blueBorderedPill'
                    : 'borderedPill'
                }
                onPress={() => {
                  if (selectedFilters.includes(filter)) {
                    setSelectedFilters(
                      selectedFilters.filter((f) => f !== filter)
                    );
                  } else {
                    setSelectedFilters([...selectedFilters, filter]);
                  }
                }}
                labelPlacement="left"
                label={
                  filter.label
                    ? ['hsa', 'cd'].includes(filter.label.toLowerCase())
                      ? filter.label.toUpperCase()
                      : capitalize(filter.label)
                    : ''
                }
              >
                {filter.dotColor && (
                  <View
                    style={[
                      styles.filterDot,
                      { backgroundColor: filter.dotColor },
                    ]}
                  />
                )}
              </Button>
            </Fragment>
          ))}
        </ScrollView>
        <Canvas style={[styles.leftMask, styles.mask]}>
          <Rect x={0} y={0} width={65} height={36}>
            <LinearGradient
              colors={[
                theme.colors.blueChartGradientEnd,
                theme.colors.modalBox100,
                theme.colors.modalBox100,
              ]}
              start={vec(32, 0)}
              end={vec(0, 0)}
            />
          </Rect>
        </Canvas>
        <Canvas style={[styles.rightMask, styles.mask]}>
          <Rect x={0} y={0} width={65} height={36}>
            <LinearGradient
              colors={[
                theme.colors.blueChartGradientEnd,
                theme.colors.modalBox100,
                theme.colors.modalBox100,
              ]}
              start={vec(0, 0)}
              end={vec(32, 0)}
            />
          </Rect>
        </Canvas>
      </View>
      <Seperator variant="bare" backgroundColor="modalSeperator" />
    </>
  );
};

export default Filters;
