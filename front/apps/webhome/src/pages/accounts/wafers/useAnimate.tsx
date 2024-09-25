import { useEffect, useRef, useState, useCallback } from 'react';

import { Location, useLocation } from 'react-router-dom';
import { useTransition } from '@react-spring/web';
import { useUpdateAccountsMutation } from '@ledget/shared-features';
import { useSpringDrag } from '@ledget/ui';
import pathMappings from '../path-mappings';

const _filterAccounts = (accounts: any[], location: Location) => {
  return accounts.filter(
    (account: any) => account.type === pathMappings.getAccountType(location)
  );
};

function useAnimate<A>({
  accounts,
  waferWidth,
  waferPadding
}: {
  accounts?: A[];
  waferWidth: number;
  waferPadding: number;
}) {
  const [updateOrder, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] =
    useUpdateAccountsMutation();
  const [freezeWaferAnimation, setFreezeWaferAnimation] = useState(false);
  const location = useLocation();

  const order = useRef(
    _filterAccounts(accounts || [], location).map((item) => item.id)
  );

  const [transitions, waferApi] = useTransition(accounts, () => ({
    from: (item: any, index: number) => ({
      x: index * (waferWidth + waferPadding) + 15 * (index + 1) ** 2,
      scale: 1,
      width: waferWidth,
      opacity: 0,
      zIndex: (accounts?.length || 0) - index
    }),
    enter: (item: any, index: number) => ({
      x: index * (waferWidth + waferPadding),
      opacity: 1
    }),
    key: (item: any) => item.id,
    immediate: freezeWaferAnimation
  }));

  const bind = useSpringDrag({
    order: order,
    indexCol: 'account_id',
    style: { axis: 'x', size: waferWidth, padding: waferPadding },
    onRest: (newOrder: string[]) => {
      if (order.current !== newOrder) {
        updateOrder(
          newOrder.map((id, index) => ({
            account: id,
            order: index
          }))
        );
      }
    },
    api: waferApi
  });

  const click = useCallback(
    (id: string) => {
      waferApi.start((index: any, item: any) => {
        if (item._item.id === id) {
          return {
            to: async (next: any) => {
              await next({ scale: 0.95 });
              await next({ scale: 1 });
            },
            config: { duration: 100 }
          };
        }
      });
    },
    [waferApi]
  );

  useEffect(() => {
    order.current = _filterAccounts(accounts || [], location).map(
      (item) => item.id
    );
  }, [accounts, location.pathname]);

  // Freeze Wafer Animation when updating order
  useEffect(() => {
    if (isUpdating) {
      setFreezeWaferAnimation(true);
    }
    let timeout: NodeJS.Timeout;
    if (isUpdateSuccess) {
      timeout = setTimeout(() => {
        setFreezeWaferAnimation(false);
      }, 2000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isUpdateSuccess, isUpdating]);

  // Start initial animation
  useEffect(() => {
    waferApi.start();
  }, [location.pathname, accounts]);

  return { transitions, bind, waferApi, click };
}

export default useAnimate;
