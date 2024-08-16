import {
  Logout,
  ConfirmDeletePlaidItem,
  EditPersonalInfo,
  ConfirmRemoveCoowner,
  AddCoOwner,
  AuthenticatorAppSetup,
  LogoutAllDevices,
  RemoveAuthenticator,
  ChangePassword
} from '@modals';
import { useAppDispatch, useAppSelector } from '@hooks';
import { clearModal, selectModal } from '@features/modalSlice';

const Modals = () => {
  const dispatch = useAppDispatch();
  const modal = useAppSelector(selectModal);

  const onClose = () => {
    dispatch(clearModal());
  }

  return (
    <>
      {modal?.name === 'logout' && <Logout onClose={onClose} />}
      {modal?.name === 'confirmDeletePlaidItem' && <ConfirmDeletePlaidItem id={modal.args.id} onClose={onClose} />}
      {modal?.name === 'editPersonalInfo' && <EditPersonalInfo onClose={onClose} />}
      {modal?.name === 'confirmRemoveCoOwner' && <ConfirmRemoveCoowner onClose={onClose} />}
      {modal?.name === 'addCoOwner' && <AddCoOwner onClose={onClose} />}
      {modal?.name === 'authenticatorAppSetup' && <AuthenticatorAppSetup onClose={onClose} />}
      {modal?.name === 'logoutAllDevices' && <LogoutAllDevices onClose={onClose} />}
      {modal?.name === 'removeAuthenticator' && <RemoveAuthenticator onClose={onClose} />}
      {modal?.name === 'changePassword' && <ChangePassword onClose={onClose} />}
    </>
  )
}

export default Modals
