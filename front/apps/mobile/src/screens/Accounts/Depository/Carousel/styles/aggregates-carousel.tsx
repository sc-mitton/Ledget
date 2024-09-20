import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  nestedContainer: {
    marginTop: 32,
    marginBottom: 16,
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    top: 12,
    right: 12
  },
  activeDotContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
  },
  activeDot: {
    position: 'absolute'
  },
  pagerView: {
    flex: 1,
    minHeight: 92
  }
});

export default styles;
