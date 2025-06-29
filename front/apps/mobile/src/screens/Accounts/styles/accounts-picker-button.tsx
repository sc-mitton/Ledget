import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  buttonBalanceContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: -1,
    marginTop: 12,
    marginBottom: 8,
  },
  accountsPickerButton: {
    gap: 8,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: -1,
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
    gap: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  balanceContainer: {
    marginRight: 4,
  },
  logos: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  logo: {
    marginLeft: -8,
  },
});

export default styles;
