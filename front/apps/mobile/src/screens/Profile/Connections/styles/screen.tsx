import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  addButtonContainer: {
    marginTop: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  container: {
    gap: 12,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});
