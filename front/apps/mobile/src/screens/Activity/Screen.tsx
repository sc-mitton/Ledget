import { BottomDrawerModal } from '@ledget/native-ui';

import { ModalScreenProps } from '@types';
import NeedsConfirmation from './NeedsConfirmation';

const Screen = (props: ModalScreenProps<'Activity'>) => {

  return (
    <BottomDrawerModal>
      <NeedsConfirmation {...props} />
    </BottomDrawerModal>
  )
}

export default Screen
