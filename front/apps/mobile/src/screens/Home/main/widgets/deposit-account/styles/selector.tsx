import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    marginHorizontal: -8,
    justifyContent: 'center',
  },
  mask: {
    position: 'absolute',
    width: 16,
    top: 12,
    height: '103%',
    zIndex: 20,
  },
  rightMask: {
    right: -8,
  },
  leftMask: {
    left: -8,
    transform: [{ rotateY: '180deg' }],
  },
  carouselItem: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
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
  grayBack: {
    zIndex: -1
  },
  optionBoxOuter: {
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  checkedIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
    zIndex: 10,
  },
  name: {
    transform: [{ translateY: 8 }],
  },
  logo: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  selectorButton: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: 4 }],
  },
  selectorButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    justifyContent: 'center',
    zIndex: 100,
    paddingHorizontal: 12
  },
});

export default styles;
