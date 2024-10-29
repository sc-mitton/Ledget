import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  selectorButton: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
  },
  optionButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  optionBoxOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 13,
    overflow: 'hidden',
  },
  optionBoxInner: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountsCarousel: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  checkedIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
    zIndex: 10,
  },
  mask: {
    position: 'absolute',
    width: 32,
    top: -2,
    height: '103%',
    zIndex: 20,
  },
  rightMask: {
    right: 0,
  },
  leftMask: {
    left: 0,
    transform: [{ rotateY: '180deg' }],
  },
});

export default styles;
