import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    justifyContent: 'space-evenly',
    width: '100%',
    height: '100%',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balanceContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});

export default styles;
