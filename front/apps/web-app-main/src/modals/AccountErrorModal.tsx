import { withSmallModal } from '@ledget/ui';

const AccountErrorModal = withSmallModal(() => {
  return (
    <div>
      <h2>Account Error</h2>
      <p>
        There was an error with your account. Please contact support in order to
        resolve this issue.
      </p>
    </div>
  );
});

export default function () {
  return <AccountErrorModal disableClose={true} blur={4} />;
}
