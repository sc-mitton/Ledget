import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    height: 40,
    marginLeft: -16,
    paddingLeft: 16,
    marginRight: -16,
    position: 'relative',
    zIndex: 10,
  },
  tabsContent: {
    paddingRight: 48,
    alignItems: 'flex-start',
  },
  tabButton: {
    marginHorizontal: 6,
  },
  buttonIcon: {
    marginRight: 8
  },
  seperator: {
    width: '200%',
    left: -200,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 21
  },
  mask: {
    position: 'absolute',
    width: 32,
    top: -2,
    height: '103%',
    zIndex: 20,
  },
  rightMask: {
    right: -16,
  },
  leftMask: {
    left: -24
  },
});

export default styles;
