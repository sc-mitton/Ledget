import { withModal } from '@ledget/ui';
import { Account } from '@ledget/shared-features';
import { Card } from '@components';

const ChangeCardColor = withModal<{ card: Account }>((props) => {
  return (
    <div>
      <Card width={192} height={120} card={props.card} />
    </div>
  );
});

export default ChangeCardColor;
