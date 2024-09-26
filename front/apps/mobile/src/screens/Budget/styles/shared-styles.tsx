import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  section: {
    height: '100%'
  },
  page: {
    flex: 1,
  },
  pagerView: {
    width: '100%',
    height: '100%'
  },
  box: {
    flex: 1
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
