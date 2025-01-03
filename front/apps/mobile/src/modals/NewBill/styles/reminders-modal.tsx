import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  fields: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: 4,
  },
  field: {
    marginVertical: 16,
    gap: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusIcon: {
    marginLeft: 4,
  },
  inputButton: {
    paddingTop: 4,
    marginTop: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  pickers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerContainer: {
    flex: 1,
    overflow: 'hidden',
    marginBottom: -64,
  },
  pickerItem: {
    fontFamily: 'SourceSans3Regular',
  },
  picker: {
    transform: [{ translateY: -32 }],
  },
  buttons: {
    paddingHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: -12,
    gap: 12,
  },
  button: {
    flex: 1,
  },
});

export default styles;
