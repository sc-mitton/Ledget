import { useRef, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useSpringRef } from '@react-spring/web';
import { CreditCard } from '@geist-ui/icons';
import { animated } from '@react-spring/web';
import Big from 'big.js';

import styles from './styles/credit-cards.module.scss';
import { useColorScheme, useSpringDrag, Window } from '@ledget/ui';
import { Account, useGetAccountsQuery } from '@ledget/shared-features';
import { DollarCents } from '@ledget/ui';
import { useScreenContext } from '@ledget/ui';
import { useTransition } from '@react-spring/web';
import { cardWidth, cardHeight, cardOffset } from './constants';
import { useUpdateAccountsMutation } from '@ledget/shared-features';
import { Card } from '@components';
import { useAppSelector, useAppDispatch } from '@hooks/store';
import {
  setFirstCardIndex,
  selectFirstCardIndex,
} from '@features/creditCardsTabSlice';
import pathMappings from '../path-mappings';
import SkeletonCards from './SkeletonCards';

const CreditSummary = () => {
  const dispatch = useAppDispatch();
  const firstCardIndex = useAppSelector(selectFirstCardIndex);
  const { isDark } = useColorScheme();

  const [searchParams, setSearchParams] = useSearchParams();
  const { data } = useGetAccountsQuery();
  const location = useLocation();
  const [cards, setCards] = useState<Account[]>(
    data?.accounts.filter(
      (a) => a.type === pathMappings.getAccountType(location)
    ) || []
  );
  const [selectedCardIndex, setSelectedCardIndex] = useState(
    firstCardIndex || 0
  );
  const [spread, setSpread] = useState(false);
  const { screenSize } = useScreenContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const order = useRef<string[]>(
    data?.accounts
      .filter((a) => a.type === pathMappings.getAccountType(location))
      .map((a) => a.id) || []
  );

  const [updateOrder] = useUpdateAccountsMutation();

  const totalBalance = useMemo(() => {
    return (
      data?.accounts
        .filter((a) => a.type === pathMappings.getAccountType(location))
        .reduce(
          (acc, account) => Big(acc).plus(account.balances.current),
          Big(0)
        )
        .times(100)
        .toNumber() || 0
    );
  }, [data]);

  const api = useSpringRef();
  const transitions = useTransition(cards, {
    from: (item, i) => {
      // prettier-ignore
      const index = selectedCardIndex === i
        ? 0
        : i >= (selectedCardIndex || 0) ? i : i + 1
      const zIndex = cards.length - index;

      return {
        x: index * cardOffset,
        zIndex,
      };
    },
    update: (item, i) => {
      const orderIndex = order.current.indexOf(item?.id || '');
      // prettier-ignore
      const index = order.current.length > 0
        ? spread
          ? orderIndex
          : selectedCardIndex === orderIndex
            ? 0
            : orderIndex >= (selectedCardIndex || 0) ? orderIndex : orderIndex + 1
        : i;
      console.log('index: ', index);
      return {
        x: spread ? index * (cardWidth + cardOffset * 1.3) : index * cardOffset,
      };
    },
    ref: api,
    config: {
      tension: 270,
      friction: 33,
      mass: 1,
    },
  });

  const bind = useSpringDrag({
    order: order,
    style: { axis: 'x', size: cardWidth, padding: cardOffset },
    onRest: (newOrder: string[]) => {
      if (order.current !== newOrder) {
        updateOrder(
          newOrder.map((id, index) => ({
            account: id,
            order: index,
          }))
        );
        if (newOrder[0] !== cards?.[0].id) {
          searchParams.set('accounts', newOrder[0]);
          setSearchParams(searchParams);
        }
      }
      api.start((index: any, item: any) => ({
        to: { zIndex: newOrder.length - newOrder.indexOf(item._item.id) },
        immediate: true,
      }));
    },
    api: api,
  });

  const click = useCallback(
    (id: string) => {
      const selectedIndex = cards?.findIndex((c) => c.id === id) || 0;
      searchParams.set('accounts', id);
      setSearchParams(searchParams);
      setSelectedCardIndex(selectedIndex);
      dispatch(setFirstCardIndex(selectedIndex));
    },
    [api, cards]
  );

  useEffect(() => {
    api.start();
  }, [spread, selectedCardIndex, firstCardIndex]);

  useEffect(() => {
    api.set((i: number, item: any) => {
      const orderIndex = order.current.indexOf(item?._item.id || '');
      // prettier-ignore
      const index = order.current.length > 0
      ? spread
        ? orderIndex
        : selectedCardIndex === orderIndex
          ? 0
          : orderIndex >= selectedCardIndex ? orderIndex : orderIndex + 1
      : i;
      const zIndex =
        order.current.length > 0
          ? order.current.length - index
          : (cards?.length || 0) - i;
      return { zIndex };
    });
  }, [spread, selectedCardIndex]);

  useEffect(() => {
    if (data) {
      const initialCards = data?.accounts.filter(
        (a) => a.type === pathMappings.getAccountType(location)
      );
      setCards(initialCards);
      if (!searchParams.get('account')) {
        searchParams.set('accounts', initialCards[firstCardIndex || 0].id);
        setSearchParams(searchParams);
      }
    }
  }, [data]);

  useEffect(() => {
    order.current = cards.map((c) => c.id);
  }, [cards]);

  return (
    <Window className={styles.container} data-size={screenSize}>
      <div className={styles.header} data-size={screenSize}>
        <h4>Total Card Balance</h4>
        <div>
          <h1>
            <DollarCents value={totalBalance} />
          </h1>
          <div className={styles.cardCount}>
            <CreditCard size={'1em'} className="icon" />
            <div>
              <span>
                {
                  data?.accounts.filter(
                    (a) => a.type === pathMappings.getAccountType(location)
                  ).length
                }
              </span>
              &nbsp;
              <span>cards</span>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => {
          setSpread(true);
          setTimeout(() => {
            scrollContainerRef.current?.scrollTo({
              left: selectedCardIndex * (cardWidth + cardOffset * 1.3),
              behavior: 'smooth',
            });
          }, 500);
        }}
        onMouseLeave={() => {
          scrollContainerRef.current?.scrollTo({
            left: 0,
            behavior: 'smooth',
          });
          setTimeout(() => {
            setSpread(false);
          }, 300);
        }}
        style={
          {
            '--card-height': `${cardHeight}px`,
          } as React.CSSProperties
        }
        className={styles.cards}
        data-size={screenSize}
      >
        {cards ? (
          transitions(
            (s, c) =>
              c && (
                <animated.button
                  draggable-item="true"
                  style={s}
                  onClick={() => click(c.id)}
                  data-size={screenSize}
                  data-is-spread={spread}
                  data-light={!isDark}
                  className={styles.cardContainer}
                  {...bind(c.id)}
                >
                  <Card card={c} width={cardWidth} height={cardHeight} />
                  {spread && c.id === searchParams.get('accounts') && (
                    <span className={styles.selectedIndicator} />
                  )}
                </animated.button>
              )
          )
        ) : (
          <SkeletonCards />
        )}
      </div>
    </Window>
  );
};

export default CreditSummary;
