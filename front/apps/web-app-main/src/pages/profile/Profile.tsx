import React, { useState } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';

import styles from './styles/profile.module.scss';
import {
  useGetMeQuery,
  useGetCoOwnerQuery,
  useGetPaymentMethodQuery,
  useUpdateRestartSubscriptionMutation,
  useGetNextInvoiceQuery,
  useGetSubscriptionQuery,
  Subscription,
} from '@ledget/shared-features';
import {
  HalfTextSlimBlueButton,
  HalfTextSlimBlueSubmitButton,
  ShimmerDiv,
  BakedSwitch,
  useColorScheme,
  CircleIconButton,
  NestedWindow,
  useScreenContext,
  StyledMenu,
} from '@ledget/ui';
import { edit } from '@ledget/media/lotties';
import { ConfirmRemoveCoOwner } from '@modals/index';
import { UpdatePersonalInfo, AddUserModal } from '@modals/index';
import { CreditCard, UserPlus } from '@geist-ui/icons';

const getStatus = (subscription: Subscription) => {
  if (subscription.cancel_at_period_end) {
    return 'canceled';
  }
  if (subscription.status === 'trialing') {
    return 'trial';
  }
  return subscription.status?.toLowerCase();
};

const Info = () => {
  const { data: user } = useGetMeQuery();
  const [editPersonalInfoModal, setEditPersonalInfoModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  const animationOptions = {
    loop: false,
    autoplay: animate,
    animationData: edit,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <>
      <div className={styles.info}>
        <div>
          <h3>{`${user?.name.first} ${user?.name.last}`}</h3>
        </div>
        <div>
          <span>{`${user?.email}`}</span>
        </div>
        <button
          onMouseEnter={() => setAnimate(true)}
          onMouseLeave={() => setAnimate(false)}
          onClick={() => setEditPersonalInfoModal(true)}
          aria-label="Edit personal info"
        >
          <Lottie
            options={animationOptions}
            speed={animate ? 2 : 20000}
            direction={animate ? 1 : -1}
            style={{ width: 26, height: 26 }}
          />
        </button>
      </div>
      {editPersonalInfoModal && (
        <UpdatePersonalInfo onClose={() => setEditPersonalInfoModal(false)} />
      )}
    </>
  );
};

const ChangePlanMenu = () => {
  const [updateSubscription, { isLoading }] =
    useUpdateRestartSubscriptionMutation();
  const { data: subscription } = useGetSubscriptionQuery();
  const { data: user } = useGetMeQuery();
  const navigate = useNavigate();

  const nickNameMap = {
    Year: 'Change to monthly billing',
    Month: 'Change to yearly billing',
  };

  const options = [
    {
      label: subscription ? nickNameMap[subscription.plan.nickname] : '',
      onClick: () => navigate('/settings/profile/change-bill-cycle'),
      cancel_at_period_end: false,
    },
    {
      label: "Don't Cancel",
      onClick: () => {
        if (subscription) {
          updateSubscription({
            subId: subscription.id,
            cancelAtPeriodEnd: false,
          });
        }
      },
      cancel_at_period_end: true,
    },
    {
      label: 'Cancel Subscription',
      onClick: () => navigate('/settings/profile/cancel-subscription'),
      cancel_at_period_end: false,
    },
  ];

  const Items = () => (
    <StyledMenu.Items>
      {options
        .filter(
          (op) => op.cancel_at_period_end === subscription?.cancel_at_period_end
        )
        .map((op, i) => (
          <StyledMenu.Item
            key={op.label}
            onClick={op.onClick}
            label={op.label}
          />
        ))}
    </StyledMenu.Items>
  );

  return (
    <StyledMenu>
      <StyledMenu.Button>
        <HalfTextSlimBlueSubmitButton
          submitting={isLoading}
          rotate={0}
          disabled={!user?.is_account_owner}
        >
          change
        </HalfTextSlimBlueSubmitButton>
      </StyledMenu.Button>
      <Items />
    </StyledMenu>
  );
};

const Plan = () => {
  const { data: subscription } = useGetSubscriptionQuery();
  const { data: nextInvoice } = useGetNextInvoiceQuery();
  const { data: user } = useGetMeQuery();
  const nextTimeStamp = nextInvoice?.next_payment_date
    ? new Date(nextInvoice.next_payment_date * 1000)
    : subscription
    ? new Date(subscription?.current_period_end * 1000)
    : new Date();
  const nextDate = nextTimeStamp.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <section>
      <h4>
        Plan
        <span
          className={styles.planLabel}
          data-cancel-at-period-end={subscription?.cancel_at_period_end}
          data-status={subscription?.status}
        >
          {subscription
            ? getStatus(subscription).charAt(0).toUpperCase() +
              getStatus(subscription).slice(1)
            : ''}
        </span>
      </h4>
      <NestedWindow className={styles.invoice}>
        <div>
          <div>Renews</div>
          {subscription && (
            <>
              <div>{`${subscription.plan.interval}ly`}</div>
              <div>
                {subscription.cancel_at_period_end
                  ? 'Ending on'
                  : 'Next charge'}
              </div>
              <div>
                {subscription.cancel_at_period_end
                  ? nextDate
                  : `$${subscription.plan.amount / 100} on ${nextDate}`}
              </div>
            </>
          )}
          {nextInvoice && nextInvoice.balance > 0 && (
            <>
              <div>{nextInvoice.balance > 0 && 'Account Credit'}</div>
              <div>
                {nextInvoice.balance > 0 && `$${nextInvoice.balance / -100}`}
              </div>
            </>
          )}
          <div>Member since</div>
          <div>
            {new Date(user?.created_on || new Date()).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }
            )}
          </div>
        </div>
        <div>
          <ChangePlanMenu />
        </div>
      </NestedWindow>
    </section>
  );
};

const PaymentMethod = () => {
  const { data } = useGetPaymentMethodQuery();
  const { data: user } = useGetMeQuery();
  const navigate = useNavigate();

  const expDate = data ? new Date(data?.exp_year, data?.exp_month) : new Date();

  return (
    <section>
      <h4>Payment Method</h4>
      <NestedWindow className={styles.paymentMethod}>
        <div>
          <CreditCard className="icon" />
          <div>
            {data && `${data.brand.charAt(0).toUpperCase()}`}
            {data && `${data.brand.slice(1)}`}
            &nbsp;&nbsp;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;
            {data && `${data.last4}`}
          </div>
          <div>{`Exp. ${expDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
          })}`}</div>
        </div>
        <HalfTextSlimBlueButton
          aria-label="Change plan"
          onClick={() => navigate('/settings/profile/update-payment')}
          disabled={!user?.is_account_owner}
        >
          update
        </HalfTextSlimBlueButton>
      </NestedWindow>
    </section>
  );
};

const Preferences = () => {
  const { isDark, setDarkMode } = useColorScheme();

  return (
    <section>
      <h4>Preferences</h4>
      <div>
        <NestedWindow>
          <ul>
            <BakedSwitch
              as="li"
              checked={isDark}
              onChange={() => setDarkMode(!isDark)}
            >
              <span>{isDark ? 'Dark' : 'Light'} mode</span>
            </BakedSwitch>
          </ul>
        </NestedWindow>
      </div>
    </section>
  );
};

const Household = () => {
  const [addUserModal, setAddUserModal] = useState(false);
  const { data: coOwner } = useGetCoOwnerQuery();
  const { data: user } = useGetMeQuery();
  const [removeCoOwnerModal, setRemoveCoOwnerModal] = useState(false);

  return (
    <>
      {removeCoOwnerModal && (
        <ConfirmRemoveCoOwner onClose={() => setRemoveCoOwnerModal(false)} />
      )}
      <section>
        <h4>Household</h4>
        <NestedWindow className={styles.household}>
          <span>Members</span>
          {user?.co_owner ? (
            coOwner && (
              <span>{`${coOwner.name.first} ${coOwner.name.last}`}</span>
            )
          ) : (
            <CircleIconButton
              size="medium"
              color="blue"
              id="add-user-button"
              onClick={() => setAddUserModal(true)}
            >
              <UserPlus className="icon" />
            </CircleIconButton>
          )}
          {user?.is_account_owner && coOwner && (
            <HalfTextSlimBlueButton onClick={() => setRemoveCoOwnerModal(true)}>
              Remove
            </HalfTextSlimBlueButton>
          )}
        </NestedWindow>
      </section>
      {addUserModal && <AddUserModal onClose={() => setAddUserModal(false)} />}
    </>
  );
};

const Account = () => {
  const { isLoading: loadingPaymentMethod } = useGetPaymentMethodQuery();
  const { isLoading: loadingInvoice } = useGetNextInvoiceQuery();
  const { isLoading: loadingSubscription } = useGetSubscriptionQuery();
  const { data: user } = useGetMeQuery();
  const { screenSize } = useScreenContext();

  return (
    <>
      <h1 data-size={screenSize} className={styles.header}>
        Profile
      </h1>
      <ShimmerDiv
        shimmering={
          loadingInvoice || loadingPaymentMethod || loadingSubscription
        }
        style={{ borderRadius: 'var(--border-radius5)' }}
      >
        <div className={styles.accountsPage}>
          <div className={styles.avatar}>
            {user &&
              `${user.name.first.charAt(0).toUpperCase()} ${user.name.last
                .charAt(0)
                .toUpperCase()}`}
          </div>
          <div className={styles.sections}>
            <Info />
            <Plan />
            <Household />
            <PaymentMethod />
            <Preferences />
          </div>
        </div>
      </ShimmerDiv>
      <Outlet />
    </>
  );
};

export default Account;
