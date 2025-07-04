import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { ResponsiveLine, Datum } from '@nivo/line';
import { ChevronRight } from '@geist-ui/icons';
import { formatCurrency, stringLimit } from '@ledget/helpers';

import styles from './styles/details.module.scss';
import { useCategoryModalContext } from './Context';
import {
  NestedWindow2,
  useColorScheme,
  DollarCents,
  LoadingRingDiv,
  ResponsiveLineContainer,
  ChartTip,
  useNivoResponsiveBaseProps,
  useNivoResponsiveLineTheme,
  BlueFadedSquareRadio,
  BakedListBox,
  BackButton,
  BillCatEmojiLabel,
} from '@ledget/ui';
import { InstitutionLogo } from '@components/pieces';
import { TransactionModalContent } from '../TransactionItem';
import {
  useLazyGetTransactionsQuery,
  useGetCategorySpendingHistoryQuery,
  selectBudgetMonthYear,
  Transaction,
} from '@ledget/shared-features';
import { EmptyBox } from '@ledget/media';
import { useAppSelector } from '@hooks/store';
import { fakeChartData, fakeDataYAxisBoundaries } from './fakeData';

const windowOptions = ['3M', '6M', '1Y', 'MAX'] as const;

const Chart = () => {
  const xaxisPadding = 8;

  const { category } = useCategoryModalContext();
  const { data: spendingSummaryData } = useGetCategorySpendingHistoryQuery({
    categoryId: category.id,
  });

  const [chartData, setChartData] = useState<Datum[]>(fakeChartData);
  const [yAxisBoundaries, setYAxisBoundaries] = useState<[number, number]>(
    fakeDataYAxisBoundaries
  );
  const [window, setWindow] = useState<'3M' | '6M' | '1Y' | 'MAX'>('3M');

  const nivoResponsiveLineBaseProps = useNivoResponsiveBaseProps({
    disabled: (spendingSummaryData?.length || 0) < 2,
  });
  const nivoResponsiveLineTheme = useNivoResponsiveLineTheme();

  useEffect(() => {
    if (!spendingSummaryData) return;

    if (spendingSummaryData.length > 2) {
      const max = spendingSummaryData.reduce(
        (acc, d) => Math.max(acc, d.amount_spent),
        -Infinity
      );
      const min = spendingSummaryData.reduce(
        (acc, d) => Math.min(acc, d.amount_spent),
        Infinity
      );

      setYAxisBoundaries([min - (max - min) * 0.25, max + (max - min) * 0.25]);

      setChartData(
        spendingSummaryData
          .filter((d) => {
            return window === 'MAX'
              ? true
              : dayjs()
                  .subtract(
                    parseInt(window.charAt(0)),
                    window.charAt(1) === 'M' ? 'month' : 'year'
                  )
                  .isBefore(dayjs(new Date(d.year, d.month, 1)));
          })
          .map((d) => ({
            x: new Date(d.year, d.month).getTime(),
            y: d.amount_spent,
          }))
      );
    }
  }, [window, spendingSummaryData]);

  return (
    <LoadingRingDiv loading={!spendingSummaryData}>
      {spendingSummaryData && spendingSummaryData?.length < 2 && (
        <span className={styles.notEnoughDataMessage}>
          Not enough data to display yet
        </span>
      )}
      <div
        className={styles.chart}
        data-disabled={!spendingSummaryData || spendingSummaryData.length < 2}
      >
        <div className={styles.windowSelect}>
          <BakedListBox
            as={BlueFadedSquareRadio}
            withChevron={false}
            options={windowOptions}
            defaultValue={'3M'}
            multiple={false}
            allowNoneSelected={true}
            onChange={setWindow}
          />
        </div>
        <ResponsiveLineContainer>
          <ResponsiveLine
            data={[{ id: 'amount-spent', data: chartData }]}
            axisBottom={{
              tickValues:
                window === 'MAX'
                  ? 'Every 6 months'
                  : window === '1Y'
                  ? 'Every 3 months'
                  : 'Every month',
              format: (value: number) =>
                window.toLowerCase().includes('Y') || window === 'MAX'
                  ? new Date(value).toLocaleString('default', {
                      month: 'short',
                      year: 'numeric',
                    })
                  : new Date(value).toLocaleString('default', {
                      month: 'short',
                    }),
            }}
            axisLeft={{
              tickValues: 4,
              tickPadding: xaxisPadding,
              format: (value: number) => formatCurrency(value, false),
            }}
            margin={{ bottom: 48, left: 36, right: 16 }}
            areaBaselineValue={yAxisBoundaries[0]}
            tooltip={({ point }) => (
              <ChartTip
                position={
                  point.index >= chartData.length / 2 ? 'left' : 'right'
                }
              >
                <span>
                  {new Date(point.data.x).toLocaleString('default', {
                    month: 'short',
                  })}
                </span>
                &nbsp;&nbsp;
                <DollarCents value={point.data.y as number} />
              </ChartTip>
            )}
            xScale={{
              type: 'time',
              format: '%Y-%m-%d',
              precision: 'month',
              useUTC: false,
            }}
            yScale={{
              type: 'linear',
              min: yAxisBoundaries[0],
              max: yAxisBoundaries[1],
            }}
            gridYValues={4}
            theme={nivoResponsiveLineTheme}
            {...nivoResponsiveLineBaseProps}
          />
        </ResponsiveLineContainer>
      </div>
    </LoadingRingDiv>
  );
};

const Transactions = ({
  setTransactionDetail,
}: {
  setTransactionDetail: React.Dispatch<
    React.SetStateAction<Transaction | undefined>
  >;
}) => {
  const { category } = useCategoryModalContext();
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const [
    getTransactions,
    { data: transactionsData, isLoading: isLoadingTransactionsData },
  ] = useLazyGetTransactionsQuery();
  const { isDark } = useColorScheme();

  // Initial fetching Transactions
  useEffect(() => {
    if (month && year) {
      getTransactions(
        {
          confirmed: true,
          ...(category.period === 'month' ? { month, year } : { year }),
          category: category.id,
        },
        true
      );
    }
  }, [month, year]);

  const handleScroll = (e: any) => {
    const bottom = e.target.scrollTop === e.target.scrollTopMax;
    // Update cursors to add new transactions node to the end
    if (bottom && transactionsData?.next) {
      getTransactions({
        confirmed: true,
        ...(category.period === 'month' ? { month, year } : { year }),
        category: category.id,
        offset: transactionsData.next,
        limit: transactionsData.limit,
      });
    }
  };

  return (
    <NestedWindow2 className={styles.transactions} onScroll={handleScroll}>
      {transactionsData?.results?.length === 0 ? (
        !isLoadingTransactionsData && (
          <div className={styles.emptyState}>
            <EmptyBox dark={isDark} size={32} />
            <span>No Spending Yet</span>
          </div>
        )
      ) : (
        <div className={styles.transactionsGrid}>
          {transactionsData?.results?.map((transaction) => (
            <div
              key={transaction.transaction_id}
              onClick={() => {
                setTransactionDetail(transaction);
              }}
            >
              <div>
                <InstitutionLogo
                  accountId={transaction.account}
                  size={'1.125em'}
                />
              </div>
              <div>
                {stringLimit(
                  transaction.preferred_name || transaction.name,
                  30
                )}
              </div>
              <div>
                <span>
                  {dayjs(transaction.datetime || transaction.date).format(
                    'MMM DD, YYYY'
                  )}
                </span>
              </div>
              <div className={`${transaction.amount < 0 ? 'debit' : ''}`}>
                <div>
                  <DollarCents value={transaction.amount} />
                </div>
                <div>
                  <ChevronRight size={'1em'} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </NestedWindow2>
  );
};

const Header = () => {
  const { category } = useCategoryModalContext();

  return (
    <div className={styles.header}>
      <BillCatEmojiLabel
        size="medium"
        emoji={category.emoji}
        color={category.period === 'month' ? 'blue' : 'green'}
      />
      <div>
        <h2>
          {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
        </h2>
        <div className={styles.spendingData}>
          <DollarCents withCents={false} value={category.amount_spent || 0} />
          <span color="secondaryText">spent of</span>
          <DollarCents withCents={false} value={category.limit_amount} />
        </div>
      </div>
    </div>
  );
};

const Details = () => {
  const [transaction, setTransaction] = useState<Transaction>();

  return (
    <div className={styles.detailsContainer}>
      <Header />
      <Chart />
      <Transactions setTransactionDetail={setTransaction} />
      {transaction && (
        <>
          <BackButton onClick={() => setTransaction(undefined)} />
          <TransactionModalContent item={transaction} />
        </>
      )}
    </div>
  );
};

export default Details;
