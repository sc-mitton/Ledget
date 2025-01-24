import { useAppSelector, useAppDispatch } from '@hooks/store';
import {
  selectTransactionModal,
  clearTransactionModal,
  selectCategoryModal,
  clearCategoryModal,
  selectBillModal,
  clearBillModal,
  clearLogoutModal,
  clearModal,
  selectModal,
  selectLogoutModal,
  refreshLogoutTimer,
} from '@features/modalSlice';
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

  const transactionModal = useAppSelector(selectTransactionModal);
  const categoryModal = useAppSelector(selectCategoryModal);
  const billModal = useAppSelector(selectBillModal);
  const modal = useAppSelector(selectModal);
  const logoutModal = useAppSelector(selectLogoutModal);

  return (
    <>
      {/* Modals */}
      {transactionModal.item && (
        <TransactionItem
          item={transactionModal.item}
          splitMode={transactionModal.splitMode}
          onClose={() => dispatch(clearTransactionModal())}
        />
      )}
      {categoryModal.category && (
        <CategoryModal
          category={categoryModal.category}
          onClose={() => dispatch(clearCategoryModal())}
        />
      )}
      {billModal.bill && (
        <BillModal
          bill={billModal.bill}
          onClose={() => dispatch(clearBillModal())}
        />
      )}
      {logoutModal.open && (
        <LogoutModal
          onClose={() => {
            dispatch(clearLogoutModal());
            dispatch(refreshLogoutTimer());
          }}
        />
      )}
      {modal === 'pinAccounts' && (
        <PinAccounts onClose={() => dispatch(clearModal())} />
      )}
      {modal === 'reAuth' && (
        <ReAuthModal onClose={() => dispatch(clearModal())} />
      )}
      {modal === 'editCategories' && (
        <EditBudgetCategories onClose={() => dispatch(clearModal())} />
      )}
      {modal === 'help' && <HelpModal onClose={() => dispatch(clearModal())} />}
      {}
    </>
  );
};

export default Modals;
