import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Edit, Edit2 } from '@geist-ui/icons';

import styles from './styles/add-bills.module.scss';
import {
  useUpdateUserMutation,
  useGetRecurringTransactionsQuery,
  useAddnewBillMutation,
  NewBill,
} from '@ledget/shared-features';
import {
  LoadingRingDiv,
  DollarCents,
  Checkbox,
  TextButton,
  BlueSubmitButton,
  Window,
  IconButtonGray,
} from '@ledget/ui';
import { getScheduleDescription } from '@utils/helpers';
import Present from '../Present';
import { useAddBillsContext, AddBillsProvider } from './Context';
import { capitalize } from '@ledget/helpers';
import CustomBill from './CustomBill';

const AddBills = () => {
  const navigate = useNavigate();
  const [updateUser, { isSuccess: hasUpdatedUser }] = useUpdateUserMutation();
  const [
    addNewBill,
    { isLoading: isAddingNewBills, isSuccess: hasAddedNewBills },
  ] = useAddnewBillMutation();
  const [editBill, setEditBill] = useState<NewBill & { id: string }>();

  const {
    data: recurringTransactions,
    isLoading: isLoadingRecurringTransactions,
  } = useGetRecurringTransactionsQuery();

  const { listItems, selectedItems, setListItems, setSelectedItems } =
    useAddBillsContext();

  useEffect(() => {
    if (recurringTransactions) {
      setListItems(
        recurringTransactions.map((t, index) => ({ ...t, id: index } as any))
      );
    }
  }, [recurringTransactions]);

  useEffect(() => {
    if (hasAddedNewBills) {
      updateUser({
        is_onboarded: true,
      });
    }
  }, [hasAddedNewBills]);

  useEffect(() => {
    if (hasUpdatedUser) {
      navigate('/budget');
    }
  }, [hasUpdatedUser]);

  const onContinue = () => {
    if (selectedItems.length > 0) {
      addNewBill(listItems.filter((item) => selectedItems.includes(item.id!!)));
    } else {
      updateUser({
        is_onboarded: true,
      });
    }
  };

  return (
    <Present>
      <Present.Background>
        <Window>
          <div className={styles.addBills}>
            <div className={styles.header}>
              <h2>Add Bills</h2>
            </div>
            <h4>Add any of your recurring payments, or enter them manually.</h4>
            <hr />
            <LoadingRingDiv
              className={styles.loadingRingDiv}
              loading={isLoadingRecurringTransactions}
            >
              <div className={styles.recurringTransactions}>
                {listItems.map((item, index) => (
                  <div className={styles.billItem}>
                    <Checkbox
                      id={`checkbox-${index}`}
                      checked={selectedItems.some((v) => v === item.id)}
                      setChecked={() => {
                        if (selectedItems.some((v) => v === item.id)) {
                          setSelectedItems((prev) =>
                            prev.filter((v) => v !== item.id)
                          );
                        } else {
                          setSelectedItems((prev) => [...prev, item.id]);
                        }
                      }}
                    />
                    <div>
                      <h3>{capitalize(item?.name || '')}</h3>
                      <span>{getScheduleDescription(item as any)}</span>
                    </div>
                    <div>
                      <DollarCents value={item?.upper_amount || 0} />
                    </div>
                    <Present.Trigger
                      as={IconButtonGray}
                      onClick={() => {
                        setEditBill(item);
                      }}
                    >
                      <Edit2 className="icon" />
                    </Present.Trigger>
                  </div>
                ))}
              </div>
            </LoadingRingDiv>
            <div className={styles.bottomButtons}>
              <Present.Trigger as={TextButton} className={styles.customButton}>
                <div>
                  Custom <Edit className="icon" />
                </div>
              </Present.Trigger>
              <BlueSubmitButton
                onClick={onContinue}
                submitting={isAddingNewBills}
              >
                Continue
              </BlueSubmitButton>
            </div>
          </div>
        </Window>
      </Present.Background>
      <CustomBill bill={editBill} />
    </Present>
  );
};

export default function () {
  return (
    <AddBillsProvider>
      <AddBills />
    </AddBillsProvider>
  );
}
