import { useEffect, useState } from 'react';

import { usePlaidLink as useLink, PlaidLinkOnSuccessMetadata } from 'react-plaid-link';

import {
  useGetPlaidTokenQuery,
  useAddNewPlaidItemMutation,
  useTransactionsSyncMutation,
  popToast
} from '@ledget/shared-features';
import { useAppDispatch } from '@hooks/store';

export function useBakedPlaidLink(onBoarding?: boolean) {
  const [isOauthRedirect, setIsOauthRedirect] = useState(false);
  const { data: fetchedToken, refetch: refetchToken } = useGetPlaidTokenQuery({
    isOnboarding: onBoarding
  });

  const [
    addNewPlaidItem,
    { data: newPlaidItem, isSuccess: newItemAddSuccess }
  ] = useAddNewPlaidItemMutation();
  const [syncTransactions] = useTransactionsSyncMutation();

  useEffect(() => {
    let timeout = setTimeout(() => {
      refetchToken();
    }, 1000 * 60 * 60 * 30); // 30 minutes
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (window.location.href.includes('oauth_state_id')) {
      setIsOauthRedirect(true);
    }
  }, []);

  useEffect(() => {
    newItemAddSuccess && syncTransactions({ item: newPlaidItem?.id });
  }, [newItemAddSuccess]);

  const config = {
    onSuccess: (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
      const institution = {
        id: metadata?.institution?.institution_id,
        name: metadata?.institution?.name
      };
      addNewPlaidItem({
        data: {
          public_token: public_token,
          accounts: metadata.accounts,
          institution: institution
        }
      });
    },
    token: fetchedToken?.link_token || null,
    ...(isOauthRedirect ? { receivedRedirectUri: window.location.href } : {})
  };

  const { open, exit, ready } = useLink(config);

  return { open, exit, ready };
}

export const useBakedUpdatePlaidLink = ({ itemId }: { itemId: string }) => {
  const {
    data: plaidToken,
    isLoading: fetchingToken,
    refetch: refetchToken
  } = useGetPlaidTokenQuery({ itemId: itemId });
  const [isOauthRedirect, setIsOauthRedirect] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let timeout = setTimeout(() => {
      refetchToken();
    }, 1000 * 60 * 30);
    return () => clearTimeout(timeout);
  }, []);

  const config = {
    onSuccess: (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
      dispatch(popToast({ type: 'success', message: 'Connection updated successfully' }));
    },
    token: plaidToken?.link_token || null,
    ...(isOauthRedirect ? { receivedRedirectUri: window.location.href } : {})
  };
  const { open, ready, exit } = useLink(config);

  useEffect(() => {
    if (window.location.href.includes('oauth_state_id')) {
      setIsOauthRedirect(true);
    }
  }, []);

  return { open, ready, exit, fetchingToken };
};
