import { useState } from 'react';
import { BottomDrawerModal } from '@ledget/native-ui';

import { ModalScreenProps } from '@types';
import NeedsConfirmation from './NeedsConfirmation';
import Header from './Header';

const Screen = (props: ModalScreenProps<'Activity'>) => {
  const [index, setIndex] = useState(0);

  return (
    <BottomDrawerModal>
      <Header setIndex={setIndex} index={index} />
      <NeedsConfirmation {...props} />
    </BottomDrawerModal>
  )
}

export default Screen
