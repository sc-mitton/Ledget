import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

import { useAppDispatch } from './store';
import { setSession } from '@features/authSlice';

export const useStoreToken = ({
  token,
  id,
}: {
  token?: string;
  id?: string;
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token && id) {
      SecureStore.setItemAsync('session', JSON.stringify({ token, id }));
      dispatch(setSession({ token, id }));
    }
  }, [token]);
};
