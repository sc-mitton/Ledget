import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  boxHeader: {
    paddingBottom: 12,
    paddingTop: 0,
    paddingLeft: 2,
    marginBottom: -8
  },
  headerContainer: {
    marginBottom: -28,
    marginTop: 0,
    zIndex: 10
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
    zIndex: -1,
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
    paddingBottom: 20,
    gap: 12,
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
