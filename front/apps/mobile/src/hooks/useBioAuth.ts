import * as LocalAuthentication from 'expo-local-authentication'
import { useAppSelector, useAppDispatch } from './store'
import { setLastAuthed, selectLastAuthed } from '@features/bioSlice'

const LAST_AUTHED_THRESHOLD = 1000 * 60 * 15 // 15 minutes

type TUseBioAuth = {
  onFail?: () => void,
  auto?: boolean,
}

export const useBioAuth = (args?: TUseBioAuth) => {
  const dispatch = useAppDispatch()
  const lastAuthed = useAppSelector(selectLastAuthed)

  const bioAuth = async (callback?: () => void) => {
    const now = Date.now()
    if (now - lastAuthed < LAST_AUTHED_THRESHOLD) {
      return true
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to continue',
    })

    if (result.success) {
      dispatch(setLastAuthed(now))
      callback && callback()
    } else {
      args?.onFail && args.onFail()
    }

    return result.success
  }

  if (args?.auto) {
    bioAuth()
  }

  return { bioAuth }
}
