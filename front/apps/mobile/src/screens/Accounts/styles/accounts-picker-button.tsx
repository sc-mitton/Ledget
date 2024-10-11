import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  buttonBalanceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
    marginTop: 0,
    marginBottom: 20
  },
  accountsPickerButton: {
    gap: 8,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: -1
  },
  accountsPickerbuttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 100,
  },
  accountsPickerButtonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  balanceContainer: {
  }
});

export default styles;
