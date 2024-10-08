import { useState } from 'react';
import { View } from 'react-native';

import styles from './styles';
import { Button } from '../../restyled/Button';
import { Box } from '../../restyled/Box';
import type { RadiosProps, Option } from './types';

export function Radios<T extends Option>(props: RadiosProps<T>) {
  const [value, setValue] = useState(props.defaultValue);

  return (
    <View style={[styles.radios, props.horizontal ? styles.horizontalRadios : undefined]}>
      {props.options.map((radio) => (
        <Box
          borderRadius='m'
          backgroundColor={
            props.cardStyle
              ? value === radio.value ? 'radioCardSelected' : 'radioCardUnselected'
              : 'transparent'
          }
          style={[styles.radio, props.cardStyle ? styles.cardRadio : undefined]}>
          <Box
            borderColor={value === radio.value ? 'faintBlueText' : 'tertiaryText'}
            style={value === radio.value ? styles.selectedRadioCircleOuter : styles.radioCircleOuter}

          >
            <Box
              backgroundColor={value === radio.value ? 'blueText' : 'transparent'}
              style={value === radio.value ? styles.selectedRadioCircleInner : styles.radioCircleInner}
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
        </Box>
      ))}
    </View>
  );
}


export default Radios;
