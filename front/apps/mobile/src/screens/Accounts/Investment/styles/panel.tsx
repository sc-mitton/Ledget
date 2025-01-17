import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  legend: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 8,
    zIndex: -1,
  },
  transactionsHeader: {
    flexGrow: 1,
  },
  blurView: {
    zIndex: 1,
    transform: [{ translateY: 12 }],
  },
  addAccountButtonContainer: {
    position: 'absolute',
    top: '43%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAccountButton: {
    position: 'absolute',
  },
});

export default styles;
