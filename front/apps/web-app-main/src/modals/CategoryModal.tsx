import { useEffect, useState, useMemo, Fragment } from 'react';

import Big from 'big.js';
import { ResponsiveLine } from '@nivo/line';
import type { Datum } from '@nivo/line';
import dayjs from 'dayjs';
import { AnimatePresence } from 'framer-motion';

import styles from './styles/category-modal.module.scss';
import { EditCategory } from './EditCategory';
import { DeleteCategory } from './DeleteCategoryModal';
import {
  useLazyGetTransactionsQuery,
  Transaction,
  useGetCategorySpendingHistoryQuery,
  selectBudgetMonthYear,
} from '@ledget/shared-features';
import type { Category } from '@ledget/shared-features';
import { useAppSelector } from '@hooks/store';
import { EmptyBox } from '@ledget/media';
import { InstitutionLogo } from '@components/pieces';
import { TransactionModalContent } from './TransactionItem';
import { formatCurrency, stringLimit } from '@ledget/helpers';
import {
  withModal,
  ChartTip,
  useNivoResponsiveBaseProps,
  useNivoResponsiveLineTheme,
  DollarCents,
  BakedListBox,
  ResponsiveLineContainer,
  PillOptionButton,
  LoadingRing,
  IconButtonHalfGray,
  DropdownDiv,
  DropdownItem,
  SlideMotionDiv,
  BackButton,
  NestedWindow2,
  useColorScheme,
} from '@ledget/ui';

const AmountSpentChart = ({
  data,
  disabled = false,
}: {
  data: Datum[];
  disabled?: boolean;
}) => {
  const xaxisPadding = 8;
  const nivoResponsiveLineBaseProps = useNivoResponsiveBaseProps({ disabled });
  const nivoResponsiveLineTheme = useNivoResponsiveLineTheme();

  const maxY = Math.max(...data.map((d) => d.y as number));
  const minY = Math.min(...data.map((d) => d.y as number));

  // The magnitude of the difference between the min and max values
  // e.g. maxY = 1120 and minY = 871, magnitude = 100
  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(maxY - minY))));
  const yScaleMin = Math.round(Math.floor(minY / magnitude) * magnitude);

  const chartMargin = useMemo<{
    top: number;
    right: number;
    bottom: number;
    left: number;
  }>(() => {
    const margin = { top: 0, right: 16, bottom: 0, left: 0 };
    const largestYAxisLabel = formatCurrency(maxY, false);

    const rootElement = document.documentElement;
    const computedStyle = getComputedStyle(rootElement);

    // Compute left margin
    const fontStyle = {
      fontFamily: computedStyle.fontFamily,
      fontSize: computedStyle.fontSize,
      fontWeight: computedStyle.fontWeight,
    };

    const tempSpan = document.createElement('span');
    tempSpan.style.fontFamily = fontStyle.fontFamily;
    tempSpan.style.fontSize = fontStyle.fontSize;
    tempSpan.style.fontWeight = fontStyle.fontWeight;

    tempSpan.textContent = largestYAxisLabel;
    document.body.appendChild(tempSpan);
    margin.left = tempSpan.offsetWidth + xaxisPadding;
    document.body.removeChild(tempSpan);

    // Compute bottom margin
    const rootFontSize = computedStyle.fontSize;
    margin.bottom = rootFontSize ? parseFloat(rootFontSize) * 2 : 16;
    margin.top = rootFontSize ? parseFloat(rootFontSize) : 16;
    return margin;
  }, [data]);

  return (
    <ResponsiveLine
      data={[{ id: 'amount-spent', data }]}
      margin={chartMargin}
      axisBottom={{
        format: (value: number) =>
          new Date(value).toLocaleString('default', { month: 'short' }),
      }}
      axisLeft={{
        tickValues: 4,
        tickPadding: xaxisPadding,
        format: (value: number) => formatCurrency(value, false),
      }}
      areaBaselineValue={minY}
      tooltip={({ point }) => (
        <ChartTip position={point.index >= data.length / 2 ? 'left' : 'right'}>
          <span>
            {new Date(point.data.x).toLocaleString('default', {
              month: 'short',
            })}
          </span>
          &nbsp;&nbsp;
          <DollarCents value={point.data.y as number} />
        </ChartTip>
      )}
      yScale={{
        type: 'linear',
        min: yScaleMin,
        max: data.length > 0 ? 'auto' : maxY / 100,
      }}
      gridYValues={4}
      theme={nivoResponsiveLineTheme}
      {...nivoResponsiveLineBaseProps}
    />
  );
};

const CategoryDetails = (props: {
  category: Category;
  setTransactionItem: React.Dispatch<
    React.SetStateAction<Transaction | undefined>
  >;
}) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { data: spendingSummaryData, isSuccess: spendingSummaryDataIsFetched } =
    useGetCategorySpendingHistoryQuery({
      categoryId: props.category.id,
    });
  const [
    getTransactions,
    { data: transactionsData, isLoading: isLoadingTransactionsData },
  ] = useLazyGetTransactionsQuery();
  const { isDark } = useColorScheme();

  const [chartData, setChartData] = useState<Datum[]>([]);
  const windowOptions = ['4 months', '1 year', '2 year', 'max'];
  const [disabledOptions, setDisabledOptions] =
    useState<(typeof windowOptions)[number][]>();
  const [window, setWindow] = useState<string>();

  // Initial fetching Transactions
  useEffect(() => {
    if (month && year) {
      getTransactions(
        {
          confirmed: true,
          ...(props.category.period === 'month' ? { month, year } : { year }),
          category: props.category.id,
        },
        true
      );
    }
  }, [month, year]);

  useEffect(() => {
    if (!spendingSummaryData) return;

    let windowEnd = new Date().setMonth(new Date().getMonth() - 4); // 4 months default end
    switch (window) {
      case '1 year':
        windowEnd = new Date().setMonth(new Date().getMonth() - 12);
        break;
      case '2 year':
        windowEnd = new Date().setMonth(new Date().getMonth() - 24);
        break;
      case 'max':
        windowEnd = 0;
        break;
    }

    if (spendingSummaryData.length > 2) {
      setChartData(
        spendingSummaryData
          .filter((d) => new Date(d.year, d.month) > new Date(windowEnd))
          .map((d) => ({
            x: new Date(d.year, d.month).getTime(),
            y: d.amount_spent,
          }))
      );
    } else {
      setChartData(
        fakeChartData.map((d) => ({
          x: new Date(d.year, d.month).getTime(),
          y: d.amount_spent,
        }))
      );
    }
  }, [window, spendingSummaryDataIsFetched]);

  useEffect(() => {
    if (!spendingSummaryData) return;

    if (spendingSummaryData.length < 4) {
      setDisabledOptions([...windowOptions]);
    } else if (spendingSummaryData.length < 12) {
      setDisabledOptions(['1 year', '2 year']);
    } else if (spendingSummaryData.length < 24) {
      setDisabledOptions(['2 year']);
    }
  }, [spendingSummaryDataIsFetched]);

  const WindowSelection = () => (
    <div>
      <BakedListBox
        as={PillOptionButton}
        options={windowOptions}
        disabled={disabledOptions}
        defaultValue={windowOptions[0]}
        onChange={setWindow}
        placement="middle"
      />
    </div>
  );

  const handleScroll = (e: any) => {
    const bottom = e.target.scrollTop === e.target.scrollTopMax;
    // Update cursors to add new transactions node to the end
    if (bottom && transactionsData?.next) {
      getTransactions({
        confirmed: true,
        ...(props.category.period === 'month' ? { month, year } : { year }),
        category: props.category.id,
        offset: transactionsData.next,
        limit: transactionsData.limit,
      });
    }
  };

  return (
    <div className={styles.categoryModal}>
      <div className={styles.categoryModalHeader}>
        <h2>
          {`${props.category.emoji}`}{' '}
          {`${props.category.name
            .charAt(0)
            .toUpperCase()}${props.category.name.slice(1)}`}
        </h2>
        <div>
          <DollarCents
            value={
              props.category.amount_spent
                ? Big(props.category.amount_spent)
                    .times(100)
                    .round(0, 2)
                    .toNumber()
                : 0
            }
          />
          <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
          {props.category.limit_amount ? (
            <DollarCents
              value={Big(props.category.limit_amount).div(100).toFixed(2)}
              withCents={false}
            />
          ) : (
            '—'
          )}
        </div>
        <span
          className={
            props.category.period === 'month' ? styles.month : styles.year
          }
        >
          {month && year && dayjs().month(month).year(year).format('MMM YYYY')}
        </span>
      </div>
      <div className={styles.graphAndDetails}>
        <div
          className={styles.chart}
          data-disabled={spendingSummaryData && spendingSummaryData.length < 2}
        >
          <ResponsiveLineContainer>
            {window && <WindowSelection />}
            {spendingSummaryData && spendingSummaryData?.length < 2 && (
              <span className={styles.notEnoughDataMessage}>
                Not enough data to display yet
              </span>
            )}
            {spendingSummaryData ? (
              <AmountSpentChart
                data={chartData}
                disabled={spendingSummaryData.length < 2}
              />
            ) : (
              <LoadingRing visible={true} />
            )}
          </ResponsiveLineContainer>
        </div>
      </div>
    </div>
  );
};

const CategoryModal = withModal<{ category: Category }>((props) => {
  const [view, setView] = useState<'detail' | 'edit' | 'delete'>('detail');
  const [transactionItem, setTransactionItem] = useState<Transaction>();

  return (
    <AnimatePresence mode="wait">
      {view === 'detail' && !transactionItem && (
        <SlideMotionDiv key="category-detail" position="first">
          <CategoryDetails
            category={props.category}
            setTransactionItem={setTransactionItem}
          />
        </SlideMotionDiv>
      )}
      {view === 'edit' && (
        <SlideMotionDiv key="edit-category" position="last">
          <EditCategory
            category={props.category}
            onClose={() => setView('detail')}
          />
        </SlideMotionDiv>
      )}
      {view === 'delete' && (
        <SlideMotionDiv key="delete-category" position="last">
          <DeleteCategory
            category={props.category}
            onClose={() => setView('detail')}
          />
        </SlideMotionDiv>
      )}
      {transactionItem && (
        <>
          <BackButton onClick={() => setTransactionItem(undefined)} />
          <TransactionModalContent item={transactionItem} />
        </>
      )}
    </AnimatePresence>
  );
});

export default CategoryModal;
