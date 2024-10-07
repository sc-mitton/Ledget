import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  radios: {
    gap: 8
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  radioCircleOuter: {
    borderWidth: 1.5,
    borderRadius: 100,
  },
  radioCircleInner: {
    margin: 5,
    width: 6,
    height: 6,
    borderRadius: 100,
  }
});

export default styles;
