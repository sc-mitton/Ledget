import { useEffect, useCallback } from 'react'
import {
  create,
  open,
  LinkSuccess,
  dismissLink,
  LinkExit,
  LinkLogLevel,
  LinkIOSPresentationStyle,
  LinkTokenConfiguration
} from 'react-native-plaid-link-sdk'

import { Platform } from 'react-native'
import {
  useGetPlaidTokenQuery,
  useAddNewPlaidItemMutation,
  useTransactionsSyncMutation,
  useUpdateAccountsMutation,
  popToast
} from '@ledget/shared-features'
import { ANDROID_PACKAGE } from '@env'
import { useAppDispatch } from './store'

export const usePlaidLink = (args: { isOnboarding?: boolean, itemId?: string, skip?: boolean } | void) => {

  const { data, refetch } = useGetPlaidTokenQuery({
    isOnboarding: args?.isOnboarding,
    itemId: args?.itemId,
    androidPackage: Platform.OS === 'android' ? ANDROID_PACKAGE : undefined
  }, { skip: args?.skip });
  const [addNewPlaidItem, { data: newPlaidItem, isSuccess: newItemAddSuccess }] = useAddNewPlaidItemMutation();
  const [syncTransactions] = useTransactionsSyncMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    newItemAddSuccess && syncTransactions({ item: newPlaidItem?.id });
  }, [newItemAddSuccess]);

  useEffect(() => {
    if (data && data.fulfilledTimeStamp < (Date.now() - 1000 * 60 * 15)) {
      refetch();
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const config: LinkTokenConfiguration = {
        token: data.link_token,
        noLoadingState: false
      }
      create(config);
    }
  }, [data]);

  const onModalClose = useCallback(() => {
    refetch();
  }, []);

  const openLink = useCallback(() => {
    const openProps = {
      onSuccess: async (success: LinkSuccess) => {
        const institution = {
          id: success.metadata.institution?.id,
          name: success.metadata.institution?.name
        };
        if (args && args.itemId) {
          dispatch(popToast({ type: 'success', message: 'Connection updated successfully' }));
        } else {
          addNewPlaidItem({
            data: {
              public_token: success.publicToken,
              accounts: success.metadata.accounts,
              institution: institution
            }
          });
        }
      },
      onExit: (linkExit: LinkExit) => {
        dismissLink();
        onModalClose();
      },
      iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
      logLevel: LinkLogLevel.ERROR,
    };
    open(openProps);
  }, [data]);

  return { openLink }
}
