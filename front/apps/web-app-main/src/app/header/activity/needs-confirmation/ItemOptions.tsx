import { useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Info as DetailsIcon,
  DollarSign,
  Maximize2,
} from '@geist-ui/icons';

import { StyledMenu, AbsPosMenu } from '@ledget/ui';
import type { AbsPosMenuProps } from '@ledget/ui';
import {
  Transaction,
  removeUnconfirmedTransaction,
  useUpdateTransactionMutation,
} from '@ledget/shared-features';
import { useAppDispatch } from '@hooks/store';
import { setModal } from '@features/modalSlice';

interface Props extends Omit<AbsPosMenuProps, 'children'> {
  transaction?: Transaction;
}

const ItemOptionsMenu = (props: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const button = useRef<HTMLButtonElement>(null);
  const [updateTransaction] = useUpdateTransactionMutation();

  useEffect(() => {
    if (props.show) {
      button.current?.click();
    }
  }, [props.show]);

  return (
    <AbsPosMenu
      show={props.show}
      setShow={props.setShow}
      pos={props.pos}
      id="new-item-menu"
    >
      <StyledMenu open={props.show}>
        <StyledMenu.Button ref={button} />
        <StyledMenu.Items>
          <StyledMenu.Item
            label="Split"
            icon={<Maximize2 className="icon" transform="rotate(45)" />}
            onClick={() => {
              if (props.transaction) {
                dispatch(
                  setModal({
                    name: 'transaction',
                    args: { item: props.transaction, splitMode: true },
                  })
                );
              }
            }}
          />
          <StyledMenu.Item
            label="New Bill"
            icon={<Plus className="icon" />}
            onClick={() => navigate(`/budget/new-category${location.search}`)}
          />
          <StyledMenu.Item
            label="Mark not spending"
            icon={<DollarSign className="icon" />}
            onClick={() => {
              if (props.transaction) {
                removeUnconfirmedTransaction(props.transaction.transaction_id);
                updateTransaction({
                  transactionId: props.transaction.transaction_id,
                  data:
                    props.transaction.detail !== 'spending'
                      ? { detail: 'spending' }
                      : { detail: null },
                });
              }
            }}
          />
          <StyledMenu.Item
            label="Details"
            icon={<DetailsIcon className="icon" />}
            onClick={() => {
              if (props.transaction) {
                dispatch(
                  setModal({
                    name: 'transaction',
                    args: { item: props.transaction },
                  })
                );
              }
            }}
          />
        </StyledMenu.Items>
      </StyledMenu>
    </AbsPosMenu>
  );
};

export default ItemOptionsMenu;
