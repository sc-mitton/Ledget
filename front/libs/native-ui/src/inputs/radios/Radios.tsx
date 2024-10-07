import { useState } from 'react';
import { View } from 'react-native';

import styles from './styles';
import { Button } from '../../restyled/Button';
import { Box } from '../../restyled/Box';
import type { RadiosProps, Option } from './types';

export function Radios<T extends Option>(props: RadiosProps<T>) {
  const [value, setValue] = useState(props.defaultValue);

  return (
    <View style={styles.radios}>
      {props.options.map((radio) => (
        <View style={styles.radio}>
          <Box
            borderColor={value === radio.value ? 'faintBlueText' : 'tertiaryText'}
            style={styles.radioCircleOuter}
          >
            <Box
              backgroundColor={value === radio.value ? 'blueText' : 'transparent'}
              style={styles.radioCircleInner}
            />
          </Box>
          <Button
            onPress={() => {
              setValue(radio.value);
              props.onChange(radio.value);
            }}
            label={radio.label}
            textColor={value === radio.value ? 'mainText' : 'secondaryText'}
          />
        </View>
      ))}
    </View>
  );
}


export default Radios;
