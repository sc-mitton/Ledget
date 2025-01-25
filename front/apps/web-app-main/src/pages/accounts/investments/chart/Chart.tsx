import { useState, useMemo, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import {
  ArrowUpRight,
  ArrowDownRight,
  Check,
  ChevronDown,
} from '@geist-ui/icons';
import dayjs from 'dayjs';
import Big from 'big.js';

import styles from './styles/chart.module.scss';
import tempDataValues from './tempData';
import {
  ResponsiveLineContainer,
  useNivoResponsiveBaseProps,
  useNivoResponsiveLineTheme,
  ChartTip,
  Window,
  StyledMenu,
  DollarCents,
  TextButton,
} from '@ledget/ui';
import {
  useGetInvestmentsBalanceHistoryQuery,
  useGetInvestmentsQuery,
  isInvestmentSupported,
} from '@ledget/shared-features';
import {
  selectAccounts,
  selectWindow,
  setInvestmentsScreenAccounts,
} from '@features/investmentsTabSlice';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import WindowSelect from './WindowSelect';
import { capitalize } from '@ledget/helpers';

const tempChartData = tempDataValues
  .map((d, i) => ({
    x: dayjs().subtract(i, 'days').format('YYYY-MM-DD'),
    y: d,
  }))
  .reverse();

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const Chart = () => {
  const dispatch = useAppDispatch();
  const window = useAppSelector(selectWindow);
  const accounts = useAppSelector(selectAccounts);
  const [chartData, setChartData] = useState(tempChartData);
  const [useingFakeData, setUseingFakeData] = useState(true);
  const [yAxiBoundaries, setYAxisBoundaries] = useState<[number, number]>();

  const { data: fetchedData } = useGetInvestmentsBalanceHistoryQuery({
    end: dayjs().format('YYYY-MM-DD'),
    start: dayjs()
      .subtract(window?.amount || 100, window?.period || 'year')
      .format('YYYY-MM-DD'),
  });
  const { data: investmentsData } = useGetInvestmentsQuery(
    {
      end: dayjs().format('YYYY-MM-DD'),
      start: dayjs()
        .subtract(window?.amount || 100, window?.period || 'year')
        .format('YYYY-MM-DD'),
    },
    {
      skip: !window,
    }
  );

  const nivoBaseProps = useNivoResponsiveBaseProps({
    primaryColor: '--blue-medium',
    gradientColorStart: '--blue-light-hover',
    gradientColorEnd: '--main-background-color',
    borderColor: '--window2',
    curve: 'natural',
    enableGridY: false,
    useMesh: !useingFakeData,
  });
  const nivoTheme = useNivoResponsiveLineTheme();

  useEffect(() => {
    if (fetchedData && fetchedData.length > 0) {
      setChartData(
        fetchedData
          .filter((acnt) =>
            accounts ? accounts.some((a) => a.id === acnt.account_id) : true
          )
          .reduce((acc, acnt) => {
            return acnt.balances
              .map((b) => ({
                x: b.date,
                y: b.value,
              }))
              .concat(acc);
          }, [] as { x: string; y: number }[])
      );
      setUseingFakeData(false);
    }
  }, [accounts]);

  const trend = useMemo(() => {
    if (fetchedData?.length === 0 || !fetchedData) return undefined;
    const last = fetchedData
      .filter((acnt) =>
        accounts ? accounts.some((a) => a.id === acnt.account_id) : true
      )
      .reduce((acc, acnt) => {
        return acc.plus(acnt.balances[0]?.value || 0);
      }, Big(0));
    const second2Last = fetchedData
      .filter((acnt) =>
        accounts ? accounts.some((a) => a.id === acnt.account_id) : true
      )
      .reduce((acc, acnt) => {
        return acc.plus(acnt.balances[1]?.value || 0);
      }, Big(0));
    return last.minus(second2Last).times(100).toNumber();
  }, [fetchedData]);

  useEffect(() => {
    if (chartData) {
      const min = chartData.reduce(
        (acc, d) => (d.y < acc ? d.y : acc),
        Infinity
      );
      const max = chartData.reduce(
        (acc, d) => (d.y >= acc ? d.y : acc),
        -Infinity
      );
      setYAxisBoundaries([min - (max - min) * 0.25, max + (max - min) * 0.33]);
    }
  }, [chartData]);

  return (
    <div className={styles.container}>
      <Window className={styles.chartContainer}>
        {useingFakeData && <span>Not enough data yet</span>}
        <ResponsiveLineContainer
          className={styles.chart}
          data-fake={useingFakeData}
        >
          <ResponsiveLine
            {...nivoBaseProps}
            data={[{ id: 'balance', data: chartData }]}
            tooltip={({ point }) => {
              return (
                !useingFakeData && (
                  <ChartTip position={'center'}>
                    <span>{`${dayjs(point.data.x).format('M/D/YY')}`}</span>
                    &nbsp;&nbsp;
                    {formatter.format(point.data.y as number)}
                  </ChartTip>
                )
              );
            }}
            xScale={{
              type: 'time',
              format: '%Y-%m-%d',
              precision: 'minute',
              useUTC: false,
            }}
            yScale={{
              type: 'linear',
              max: yAxiBoundaries?.[1],
              min: yAxiBoundaries?.[0],
            }}
            margin={{ top: 4 }}
            axisBottom={{ format: (value) => '' }}
            theme={nivoTheme}
          />
        </ResponsiveLineContainer>
      </Window>
      <div className={styles.accountsSelect}>
        <StyledMenu>
          <StyledMenu.Button
            as={TextButton}
            className={styles.accountsSelectButton}
          >
            <div>
              <span>{accounts?.[0].name || 'All Accounts'} </span>
              <ChevronDown className="icon" />
            </div>
          </StyledMenu.Button>
          <StyledMenu.Items>
            {investmentsData?.results
              .filter((a) => isInvestmentSupported(a))
              .map((a) => (
                <StyledMenu.Item
                  className={styles.item}
                  data-selected={accounts?.some(
                    (acnt) => acnt.id === a.account_id
                  )}
                  renderLeft={() => <span>{capitalize(a.account_name)}</span>}
                  renderRight={() => <Check className="icon" />}
                  onClick={() =>
                    dispatch(
                      setInvestmentsScreenAccounts([
                        { id: a.account_id, name: a.account_name },
                      ])
                    )
                  }
                />
              ))}
            <StyledMenu.Item
              className={styles.item}
              data-selected={!accounts}
              renderLeft={() => <span>All Accounts</span>}
              renderRight={() => <Check className="icon" />}
              onClick={() => dispatch(setInvestmentsScreenAccounts(undefined))}
            />
          </StyledMenu.Items>
        </StyledMenu>
        <div className={styles.balanceContainer}>
          <h1>
            <DollarCents
              fontSize={24}
              variant="bold"
              value={
                investmentsData?.results
                  .filter((a) => isInvestmentSupported(a))
                  .reduce((acc, investment) => {
                    if (accounts) {
                      return accounts.some(
                        (a) => a.id === investment.account_id
                      )
                        ? acc.plus(investment.balance)
                        : acc;
                    }
                    return acc.plus(investment.balance);
                  }, Big(0))
                  ?.times(100)
                  .toNumber() || 0
              }
            />
          </h1>
          {trend !== undefined && (
            <div className={styles.trendContainer}>
              <DollarCents
                color="tertiaryText"
                value={trend}
                withCents={false}
              />
              {trend >= 0 ? (
                <ArrowUpRight className="icon" />
              ) : (
                <ArrowDownRight className="icon" />
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.windowMenu} data-fake={useingFakeData}>
        <WindowSelect />
      </div>
    </div>
  );
};

export default Chart;
