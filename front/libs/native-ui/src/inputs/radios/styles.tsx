import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  radios: {
    gap: 8,
    marginVertical: 8,
  },
  horizontalRadios: {
    flexDirection: 'row',
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRadio: {
    paddingHorizontal: 10,
  },
  selectedRadioCircleOuter: {
    borderWidth: 1.5,
    borderRadius: 100,
  },
  radioCircleOuter: {
    borderWidth: 1.5,
    borderRadius: 100,
    margin: 2,
  },
  selectedRadioCircleInner: {
    margin: 5,
    width: 6,
    height: 6,
    borderRadius: 100,
  },
  radioCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 100,
  },
});

export default styles;
