import { useState } from 'react';
import { BottomDrawerModal } from '@ledget/native-ui';

import { ModalScreenProps } from '@types';
import NeedsConfirmation from './New/NeedsConfirmation';
import History from './History/History';
import Header from './Header';
import Provider from './context';

const Screen = (props: ModalScreenProps<'Activity'>) => {
  const [index, setIndex] = useState(props.route.params?.tab || 0);

  return (
    <Provider>
      <BottomDrawerModal defaultExpanded={props.route.params?.expanded}>
        {({ expanded }) => (
          <>
            <Header setIndex={setIndex} index={index} />
            {index === 0 ? (
              <NeedsConfirmation {...props} expanded={expanded} />
            ) : (
              <History {...props} />
            )}
          </>
        )}
      </BottomDrawerModal>
    </Provider>
  );
};

export default Screen;
