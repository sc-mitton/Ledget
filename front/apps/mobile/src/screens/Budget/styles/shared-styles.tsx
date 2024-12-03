import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 16,
    width: '100%'
  },
  pagerView: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
  },
  boxTopHalf: {
    borderRadius: 12,
    paddingBottom: 12
  },
  boxBottomHalf: {
    zIndex: -1,
    overflow: 'hidden',
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
    gap: 12,
    transform: [{ translateY: -12 }],
    flexDirection: 'row',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  carouselDots: {
    alignItems: 'center',
    zIndex: 100,
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    right: -6,
    height: 20,
    paddingHorizontal: 24
  }
});

export default styles;
