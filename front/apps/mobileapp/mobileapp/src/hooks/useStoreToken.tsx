import * as SecureStore from 'expo-secure-store'
import { useEffect } from 'react'

import { useAppDispatch } from './store'
import { setSessionToken } from '@ledget/shared-features'

export const useStoreToken = (token?: string) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (token) {
      SecureStore.setItemAsync('session_token', token)
      dispatch(setSessionToken(token))
    }
  }, [token])

}
