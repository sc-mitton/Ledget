import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  section: {
  },
  page: {
    paddingHorizontal: 16,
    width: '100%'
  },
  pagerView: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
  },
  box: {
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
    paddingBottom: 20,
    gap: 12
  },
  carouselDots: {
    alignItems: 'center',
    zIndex: 100,
    justifyContent: 'center',
    position: 'absolute',
    top: 14,
    right: -4,
    height: 20,
    paddingHorizontal: 24
  }
});

export default styles;
