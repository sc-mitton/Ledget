import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 4
  },
  headerContainer: {
    width: '100%',
    paddingBottom: 4
  },
  balanceContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    marginLeft: 4
  }
});

export default styles;
