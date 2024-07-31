import { Logout } from '@modals';
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
    </>
  )
}

export default Modals
