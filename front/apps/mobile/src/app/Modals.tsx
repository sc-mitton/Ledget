import {
  Logout,
  ConfirmDeletePlaidItem,
  EditPersonalInfo,
  ConfirmRemoveCoowner
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
    </>
  )
}

export default Modals
