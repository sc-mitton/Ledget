import { useAppSelector, useAppDispatch } from '@hooks/store';
import { selectModal, setModal } from '@features/modalSlice';
import { refreshLogoutTimer } from '@features/authSlice';
import {
  BillModal,
  TransactionItem,
  CategoryModal,
  Help as HelpModal,
  Logout as LogoutModal,
  EditBudgetCategories,
  PinAccounts,
  InvestmentTransaction,
} from '@modals/index';
import { ReAuthModal } from '@utils/withReAuth';

const Modals = () => {
  const dispatch = useAppDispatch();

  const modal = useAppSelector(selectModal);

  return (
    <>
      {/* Modals */}
      {modal?.name === 'investmentTransaction' && (
        <InvestmentTransaction
          {...modal.args}
          onClose={() => dispatch(setModal())}
        />
      )}
      {modal?.name === 'transaction' && (
        <TransactionItem {...modal.args} onClose={() => dispatch(setModal())} />
      )}
      {modal?.name === 'category' && (
        <CategoryModal {...modal.args} onClose={() => dispatch(setModal())} />
      )}
      {modal?.name === 'bill' && (
        <BillModal {...modal.args} onClose={() => dispatch(setModal())} />
      )}
      {modal?.name === 'logout' && (
        <LogoutModal
          {...modal.args}
          onClose={() => {
            dispatch(refreshLogoutTimer());
          }}
        />
      )}
      {modal?.name === 'pinAccounts' && (
        <PinAccounts onClose={() => dispatch(setModal())} />
      )}
      {modal?.name === 'reAuth' && (
        <ReAuthModal onClose={() => dispatch(setModal())} />
      )}
      {modal?.name === 'editCategories' && (
        <EditBudgetCategories onClose={() => dispatch(setModal())} />
      )}
      {modal?.name === 'help' && (
        <HelpModal onClose={() => dispatch(setModal())} />
      )}
    </>
  );
};

export default Modals;
