import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 4
  },
  balanceContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    marginLeft: 4
  },
  accountHeaderContainer: {
    marginBottom: 52,
    marginLeft: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 12
  },
  accountHeaderText: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 4
  },
  defaultHeaderContainer: {
    marginBottom: 44
  },
  logos: {
    flexDirection: 'row',
    marginLeft: 8
  },
  logo: {
    marginLeft: -8
  }
});

export default styles;
