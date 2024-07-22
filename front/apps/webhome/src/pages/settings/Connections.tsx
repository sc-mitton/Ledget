import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  Fragment
} from 'react';

import { useSpring, animated } from '@react-spring/web';
import { useSearchParams } from 'react-router-dom';

import styles from './styles/connections.module.scss';
import {
  useGetPlaidItemsQuery,
  useDeletePlaidItemMutation,
  PlaidItem as TPlaidItem
} from '@ledget/shared-features';
import { useBakedPlaidLink, useBakedUpdatePlaidLink } from '@utils/hooks';
import { withSmallModal } from '@ledget/ui';
import SubmitForm from '@components/pieces/SubmitForm';
import { Relink } from '@ledget/media';
import {
  SecondaryButton,
  BlueSubmitButton,
  CircleIconButton,
  ShimmerDiv,
  DeleteButton,
  BlueSlimButton2,
  Tooltip,
  Base64Logo,
  ShadowedContainer
} from '@ledget/ui';
import { withReAuth } from '@utils/index';
import { Edit2, Plus } from '@geist-ui/icons';

interface DeleteQueItem {
  itemId: string;
  accountId?: string;
}

interface DeleteContextProps {
  deleteQue: DeleteQueItem[];
  setDeleteQue: React.Dispatch<React.SetStateAction<DeleteQueItem[]>>;
  plaidItems?: TPlaidItem[];
  fetchingPlaidItems: boolean;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteContext = createContext<DeleteContextProps | undefined>(undefined);

const useDeleteContext = () => {
  const context = useContext(DeleteContext);
  if (!context) {
    throw new Error('useDeleteContext must be used within a DeleteContext');
  }
  return context;
};

const ConnectionsContext = ({ children }: { children: React.ReactNode }) => {
  const [deleteQue, setDeleteQue] = useState<DeleteQueItem[]>([]);
  const { data: plaidItems, isLoading: fetchingPlaidItems } =
    useGetPlaidItemsQuery();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setEditing(false);
    setDeleteQue([]);
  }, [plaidItems]);

  const value = {
    deleteQue,
    setDeleteQue,
    plaidItems,
    fetchingPlaidItems,
    editing,
    setEditing
  };

  return (
    <DeleteContext.Provider value={value}>{children}</DeleteContext.Provider>
  );
};

const DeleteAllButton = ({ onClick }: { onClick: () => void }) => {
  const [loaded, setLoaded] = useState(false);
  const [deleteClass, setDeleteClass] = useState('');
  const { editing } = useDeleteContext();

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
    } else if (loaded && editing) {
      setDeleteClass('show');
    } else if (!editing) {
      setDeleteClass('remove');
    }
  }, [editing]);

  return (
    <div>
      <Tooltip
        msg={'Remove account'}
        ariaLabel={'Remove Account'}
        type={'left'}
      >
        <DeleteButton
          className={deleteClass}
          aria-label="Remove account"
          onClick={() => onClick()}
          visible={editing}
        />
      </Tooltip>
    </div>
  );
};

const ReconnectButton = ({ itemId = '' }) => {
  const { open, fetchingToken } = useBakedUpdatePlaidLink({ itemId });

  return (
    <div className={styles.reconnect} data-wiggle={true}>
      <BlueSlimButton2
        onClick={() => !fetchingToken && open()}
        aria-label="Reconnect"
      >
        Reconnect
      </BlueSlimButton2>
    </div>
  );
};

const PlaidItem = ({ item }: { item: TPlaidItem }) => {
  const { deleteQue, setDeleteQue } = useDeleteContext();
  const [removed, setRemoved] = useState(false);

  const handleRemoveAll = () => {
    // Filter out accounts from delete que
    const filtered = deleteQue.filter((que) => que.itemId !== item.id);
    setDeleteQue([...filtered, { itemId: item.id }]);
  };

  useEffect(() => {
    // If the plaid item is in the delete que, set the removed class so
    // the header can be hidden
    if (deleteQue.some((que) => que.itemId === item.id && !que.accountId)) {
      setRemoved(true);
    } else {
      setRemoved(false);
    }

    // If all accounts for the item are in the delete que, swap it out
    // for the plaid item
    if (
      item.accounts.every((account) =>
        deleteQue.some((que) => que.accountId === account.id)
      )
    ) {
      const filtered = deleteQue.filter((que) => que.itemId !== item.id);
      setDeleteQue([...filtered, { itemId: item.id }]);
    }
  }, [deleteQue]);

  const springProps = useSpring({
    opacity: removed ? 0 : 1,
    maxHeight: removed ? 0 : 1000,
    config: {
      tension: removed ? 200 : 200,
      friction: removed ? 30 : 100
    }
  });

  return (
    <animated.div className={styles.institution} style={springProps}>
      <div>
        <div>
          <Base64Logo
            data={item.institution.logo}
            alt={item.institution.name.charAt(0)}
            style={{ marginRight: '.75em' }}
            size={'1.4em'}
          />
          <h4>{item.institution.name}</h4>
        </div>
        <div>
          <DeleteAllButton onClick={handleRemoveAll} />
        </div>
      </div>
      <div className={styles.tableHeaders}>
        <h4>Acct. Name</h4>
        <h4>Type</h4>
        <h4>Acct. Num.</h4>
      </div>
      <div className={styles.accounts}>
        {item.accounts.map((account) => (
          <Fragment key={account.name}>
            <div>{account.name}</div>
            <div>
              {`${account.subtype} ${account.type === 'loan' ? 'loan' : ''}`}
            </div>
            <div>
              &nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;
              {account.mask}
            </div>
          </Fragment>
        ))}
      </div>
      {(item.login_required || item.permission_revoked) && <ReconnectButton itemId={item.id} />}
    </animated.div>
  );
};

const ConfirmModal = withReAuth(
  withSmallModal((props) => {
    const { deleteQue } = useDeleteContext();
    const [deletePlaidItem, { isLoading, isSuccess }] =
      useDeletePlaidItemMutation();
    const [, setSearchParams] = useSearchParams();

    useEffect(() => {
      setSearchParams({ confirm: 'delete' });
      return () => setSearchParams({});
    }, [deleteQue]);

    const finalSubmit = () => {
      for (const que of deleteQue) {
        deletePlaidItem({ itemId: que.itemId });
      }
    };

    useEffect(() => {
      if (isSuccess) {
        const timeout = setTimeout(() => {
          props.closeModal();
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }, [isSuccess]);

    return (
      <div className={styles.confirmModal}>
        <h2>Are you sure?</h2>
        <p>
          This will remove the connection to your bank account and all of the
          data associated with this bank.
          <strong>This action cannot be undone.</strong>
        </p>
        <div>
          <SecondaryButton
            onClick={() => {
              props.closeModal();
            }}
            aria-label="Cancel"
          >
            Cancel
          </SecondaryButton>
          <BlueSubmitButton
            onClick={finalSubmit}
            submitting={isLoading}
            success={isSuccess}
            aria-label="Confirm"
          >
            Confirm
          </BlueSubmitButton>
        </div>
      </div>
    );
  })
);

const EmptyState = () => (
  <div className={styles.noConnections}>
    <h2>No Connections</h2>
    <span>Click the plus icon to get started </span>
    <br />
    <span>connecting your accounts</span>
  </div>
);

const MainHeader = ({ onPlus }: { onPlus: () => void }) => {
  const { editing, setEditing, plaidItems } = useDeleteContext();

  return (
    <div className={styles.header}>
      <h1>Connections</h1>
      <div>
        {!editing && plaidItems!.length > 0 && (
          <Tooltip
            msg={'Edit connections'}
            ariaLabel={'Edit Connections'}
            type={'left'}
          >
            <CircleIconButton
              onClick={() => setEditing(!editing)}
              aria-label="Edit institution connections"
            >
              <Edit2 className="icon small" />
            </CircleIconButton>
          </Tooltip>
        )}
        <Tooltip msg={'Add account'} ariaLabel={'Add Account'} type={'left'}>
          <CircleIconButton
            onClick={onPlus}
            aria-label="Add institution connection"
          >
            <Plus className="icon small" />
          </CircleIconButton>
        </Tooltip>
      </div>
    </div>
  );
};

const Connections = () => {
  const {
    plaidItems,
    fetchingPlaidItems,
    editing,
    setEditing,
    deleteQue,
    setDeleteQue
  } = useDeleteContext();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { open } = useBakedPlaidLink();

  // if (import.meta.env.VITE_PLAID_REDIRECT_URI) {
  //     config.receivedRedirectUri = import.meta.env.VITE_PLAID_REDIRECT_URI
  // }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (deleteQue.length > 0) {
      setShowConfirmModal(true);
    } else {
      setEditing(false);
    }
  };

  return (
    <>
      {showConfirmModal && (
        <ConfirmModal
          blur={2}
          onClose={() => {
            setShowConfirmModal(false);
            setEditing(false);
            setDeleteQue([]);
          }}
        />
      )}
      <ShimmerDiv
        shimmering={fetchingPlaidItems}
        className={styles.connectionsPage}
      >
        <MainHeader onPlus={() => open()} />
        {plaidItems?.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ShadowedContainer className={styles.accountsList}>
              {plaidItems?.map((item) => (
                <PlaidItem key={item.id} item={item} />
              ))}
            </ShadowedContainer>
            <div>
              {editing && (
                <form onSubmit={handleFormSubmit}>
                  {deleteQue.map((val, index) => (
                    <input
                      key={index}
                      type="hidden"
                      name={val.accountId ? `accounts[${index}][id]` : `items[${index}][id]`}
                      value={val.accountId ? val.accountId : val.itemId}
                    />
                  ))}
                  <SubmitForm
                    submitting={false}
                    onCancel={() => {
                      setDeleteQue([]);
                      setEditing(false);
                    }}
                  />
                </form>
              )}
            </div>
          </>
        )}
      </ShimmerDiv>
    </>
  );
};

const ConnectionsComponent = () => (
  <ConnectionsContext>
    <Connections />
  </ConnectionsContext>
);

export default ConnectionsComponent;
