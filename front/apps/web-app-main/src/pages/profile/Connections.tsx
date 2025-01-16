import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  Fragment,
} from 'react';
import { Repeat, Check } from '@geist-ui/icons';

import { useSpring, animated } from '@react-spring/web';
import { useSearchParams } from 'react-router-dom';

import styles from './styles/connections.module.scss';
import {
  useGetPlaidItemsQuery,
  useDeletePlaidItemMutation,
  PlaidItem as TPlaidItem,
} from '@ledget/shared-features';
import { useBakedPlaidLink, useBakedUpdatePlaidLink } from '@utils/hooks';
import { LoadingRingDiv, useScreenContext, withSmallModal } from '@ledget/ui';
import {
  SecondaryButton,
  BlueSubmitButton,
  IconButtonBorderedGray,
  DeleteButton,
  TextButtonBlue,
  Tooltip,
  Base64Logo,
  ShadowedContainer,
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
  showConfirmModal: boolean;
  setShowConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    setEditing,
    showConfirmModal,
    setShowConfirmModal,
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
      <DeleteButton
        className={deleteClass}
        aria-label="Remove account"
        onClick={() => onClick()}
        visible={editing}
      />
    </div>
  );
};

const ReconnectButton = ({ itemId = '' }) => {
  const { open, fetchingToken } = useBakedUpdatePlaidLink({ itemId });

  return (
    <div className={styles.reconnect} data-wiggle={true}>
      <TextButtonBlue
        onClick={() => !fetchingToken && open()}
        aria-label="Reconnect"
      >
        Reconnect
        <Repeat className="icon" />
      </TextButtonBlue>
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
      friction: removed ? 30 : 100,
    },
  });

  return (
    <animated.div className={styles.institution} style={springProps}>
      <div>
        <div>
          <Base64Logo
            data={item.institution?.logo}
            alt={item.institution?.name?.charAt(0)}
            style={{ marginRight: '.75em' }}
            size={'1.4em'}
          />
          <h4>{item.institution?.name}</h4>
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
      {(item.login_required || item.permission_revoked) && (
        <ReconnectButton itemId={item.id} />
      )}
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
        deletePlaidItem(que.itemId);
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
    <div>
      <span>Click the plus icon to get started </span>
      <br />
      <span>connecting your accounts</span>
    </div>
  </div>
);

const Buttons = ({ onPlus }: { onPlus: () => void }) => {
  const {
    editing,
    setEditing,
    plaidItems,
    deleteQue,
    setDeleteQue,
    setShowConfirmModal,
  } = useDeleteContext();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (deleteQue.length > 0) {
      setShowConfirmModal(true);
    } else {
      setEditing(false);
    }
  };

  return (
    <div>
      {!editing && (plaidItems?.length || 0) > 0 && (
        <Tooltip
          msg={'Edit connections'}
          ariaLabel={'Edit Connections'}
          type={'left'}
        >
          <IconButtonBorderedGray
            onClick={() => setEditing(!editing)}
            aria-label="Edit institution connections"
          >
            <Edit2 className="icon" />
          </IconButtonBorderedGray>
        </Tooltip>
      )}
      {editing && (
        <form onSubmit={handleFormSubmit} className={styles.form}>
          {deleteQue.map((val, index) => (
            <input
              key={index}
              type="hidden"
              name={
                val.accountId ? `accounts[${index}][id]` : `items[${index}][id]`
              }
              value={val.accountId ? val.accountId : val.itemId}
            />
          ))}
          <IconButtonBorderedGray
            onClick={() => {
              setDeleteQue([]);
              setEditing(false);
            }}
          >
            Cancel
          </IconButtonBorderedGray>
          <IconButtonBorderedGray type="submit">Delete</IconButtonBorderedGray>
        </form>
      )}
      {!editing && (
        <Tooltip msg={'Add account'} ariaLabel={'Add Account'} type={'left'}>
          <IconButtonBorderedGray
            onClick={onPlus}
            aria-label="Add institution connection"
          >
            <Plus className="icon" />
          </IconButtonBorderedGray>
        </Tooltip>
      )}
    </div>
  );
};

const Connections = () => {
  const {
    plaidItems,
    fetchingPlaidItems,
    setEditing,
    setDeleteQue,
    showConfirmModal,
    setShowConfirmModal,
  } = useDeleteContext();
  const { open } = useBakedPlaidLink();
  const { screenSize } = useScreenContext();

  // if (import.meta.env.VITE_PLAID_REDIRECT_URI) {
  //     config.receivedRedirectUri = import.meta.env.VITE_PLAID_REDIRECT_URI
  // }

  return (
    <>
      <div data-size={screenSize} className={styles.header}>
        <h1>Connections</h1>
        <Buttons onPlus={() => open()} />
      </div>
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
      {plaidItems?.length === 0 ? (
        <EmptyState />
      ) : (
        <LoadingRingDiv
          size={34}
          loading={fetchingPlaidItems}
          className={styles.connectionsPage}
        >
          <>
            <ShadowedContainer className={styles.accountsList}>
              {plaidItems?.map((item) => (
                <PlaidItem key={item.id} item={item} />
              ))}
            </ShadowedContainer>
          </>
        </LoadingRingDiv>
      )}
    </>
  );
};

const ConnectionsComponent = () => (
  <ConnectionsContext>
    <Connections />
  </ConnectionsContext>
);

export default ConnectionsComponent;
