import { useEffect, useState } from 'react';

import {
  usePlaidLink as useLink,
  PlaidLinkOnSuccessMetadata,
} from 'react-plaid-link';

import {
  useGetPlaidTokenQuery,
  useExchangePlaidTokenMutation,
  useTransactionsSyncMutation,
  popToast,
} from '@ledget/shared-features';
import { useAppDispatch } from '@hooks/store';

export function useBakedPlaidLink(onBoarding?: boolean) {
  const [isOauthRedirect, setIsOauthRedirect] = useState(false);
  const { data: fetchedToken, refetch: refetchToken } = useGetPlaidTokenQuery({
    isOnboarding: onBoarding,
  });

  const [
    exchangePlaidToken,
    { data: newPlaidItem, isSuccess: newItemAddSuccess },
  ] = useExchangePlaidTokenMutation();
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
      const institution = metadata?.institution
        ? {
            id: metadata.institution.institution_id,
            name: metadata.institution.name,
          }
        : undefined;
      exchangePlaidToken({
        data: {
          public_token: public_token,
          accounts: metadata.accounts,
          institution: institution,
        },
      });
    },
    token: fetchedToken?.link_token || null,
    ...(isOauthRedirect ? { receivedRedirectUri: window.location.href } : {}),
  };

  const { open, exit, ready } = useLink(config);

  return { open, exit, ready };
}

export const useBakedUpdatePlaidLink = ({ itemId }: { itemId: string }) => {
  const {
    data: plaidToken,
    isLoading: fetchingToken,
    refetch: refetchToken,
  } = useGetPlaidTokenQuery({ itemId: itemId });

  const [
    exchangePlaidToken,
    { data: newPlaidItem, isSuccess: newItemAddSuccess },
  ] = useExchangePlaidTokenMutation();

  const [syncTransactions] = useTransactionsSyncMutation();

  const [isOauthRedirect, setIsOauthRedirect] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    newItemAddSuccess && syncTransactions({ item: newPlaidItem?.id });
  }, [newItemAddSuccess]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      refetchToken();
    }, 1000 * 60 * 30);
    return () => clearTimeout(timeout);
  }, []);

  const config = {
    onSuccess: (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
      dispatch(
        popToast({
          type: 'success',
          message: 'Connection updated successfully',
        })
      );
      exchangePlaidToken({
        data: {
          public_token,
          accounts: metadata.accounts,
        },
      });
    },
    token: plaidToken?.link_token || null,
    ...(isOauthRedirect ? { receivedRedirectUri: window.location.href } : {}),
  };
  const { open, ready, exit } = useLink(config);

  useEffect(() => {
    if (window.location.href.includes('oauth_state_id')) {
      setIsOauthRedirect(true);
    }
  }, []);

  return { open, ready, exit, fetchingToken };
};
