import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  filters: {
    paddingBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  filter: {
    marginRight: 12,
  },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: 8,
    marginRight: 8
  },
  iconFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mask: {
    position: 'absolute',
    width: 32,
    height: '103%'
  },
  rightMask: {
    right: 0,
  },
  leftMask: {
    left: -8
  },
  groupDelimiter: {
    height: 24,
    width: 2,
    borderRadius: 2,
    marginRight: 12,
  }
});

export default styles;
