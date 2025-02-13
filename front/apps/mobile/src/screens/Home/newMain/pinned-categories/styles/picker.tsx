import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  categoryOption: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 32,
    marginVertical: 8,
    height: '100%',
  },
  categoriesScrollSelector: {
    flexGrow: 1,
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  categoriesCarousel: {
    width: '200%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorContainer: {
    height: 160,
    marginHorizontal: -16,
    minWidth: '100%',
  },
  mask: {
    position: 'absolute',
    width: 24,
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
  emojiLabelContainer: {
    position: 'absolute',
    bottom: '40%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiLabel: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  skeletonContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  selectorButton: {
    flex: 1,
    flexGrow: 1,
  },
  selectorButtons: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: -10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  selectedContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    justifyContent: 'center',
  },
  selectedCategory: {
    marginLeft: -4,
  },
  checkContainer: {
    position: 'absolute',
    zIndex: 10,
    top: -6,
    right: -4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
