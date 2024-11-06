import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    marginHorizontal: -8,
    justifyContent: 'center',
  },
  mask: {
    position: 'absolute',
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
  accountsCarousel: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 22,
    gap: 2,
  },
  skeleton: {
    width: '100%',
    height: '100%',
  },
  carouselItem: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  optionBoxOuter: {
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  optionBoxInner: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    height: '100%',
  },
  touchable: {
    justifyContent: 'flex-end',
    zIndex: 100,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  logoContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  name: {
    transform: [{ translateY: 8 }],
  },
  checkedIcon: {
    position: 'absolute',
    top: -4,
    right: -6,
    zIndex: 10,
  },
  grayBack: {
    zIndex: -1
  },
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
  saveButtonContainer: {
    flexDirection: 'row',
  },
  fontStyle: {
    fontFamily: 'SourceSans3SemiBold',
    fontSize: 18
  },
  balanceContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -6 }],
  },
  bottomRow: {
    gap: 6,
    alignItems: 'center',
  },
  carouselDotsContainer: {
    transform: [{ translateX: -2 }],
  }
});

export default styles;
