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
  useTransactionsSyncMutation
} from '@ledget/shared-features'

export const usePlaidLink = (args: { isOnboarding?: boolean, itemId?: string } | void) => {
  const { data, refetch } = useGetPlaidTokenQuery({
    isOnboarding: args?.isOnboarding,
    itemId: args?.itemId,
    androidPackage: Platform.OS === 'android' ? process.env.ANDROID_PACKAGE : undefined
  })
  const [
    addNewPlaidItem,
    { data: newPlaidItem, isSuccess: newItemAddSuccess }
  ] = useAddNewPlaidItemMutation();
  const [syncTransactions] = useTransactionsSyncMutation();

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

  const openLink = useCallback(() => {
    const openProps = {
      onSuccess: async (success: LinkSuccess) => {
        const institution = {
          id: success.metadata.institution?.id,
          name: success.metadata.institution?.name
        };
        addNewPlaidItem({
          data: {
            public_token: success.publicToken,
            accounts: success.metadata.accounts,
            institution: institution
          }
        });
      },
      onExit: (linkExit: LinkExit) => {
        console.log('Exit: ', linkExit);
        dismissLink();
      },
      iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
      logLevel: LinkLogLevel.ERROR,
    };
    open(openProps);
  }, [data]);

  return { openLink }
}
