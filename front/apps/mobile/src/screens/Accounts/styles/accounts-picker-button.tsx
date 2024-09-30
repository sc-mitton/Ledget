import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  buttonBalanceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 32,
    paddingBottom: 4,
    zIndex: -1,
  },
  accountsPickerButton: {
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: -1,
  },
  accountsPickerbuttonContent: {
    marginVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  accountsPickerButtonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  balanceContainer: {
  }
});

export default styles;
