import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  holdings: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  holding: {
    marginHorizontal: 2,
  },
  holdingTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default styles;
