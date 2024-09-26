import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  accountsPickerButton: {
    width: '100%',
    marginTop: 16,
    marginBottom: 10,
    paddingLeft: 24,
    paddingRight: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: -1
  },
  accountsPickerButtonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  balanceContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
    borderRadius: 16,
  }
});

export default styles;
