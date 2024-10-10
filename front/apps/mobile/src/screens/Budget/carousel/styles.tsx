import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '103%',
    alignItems: 'center',
    paddingVertical: 10,
    marginLeft: -12,
    overflow: 'hidden',
  },
  scrollViewContent: {
    gap: 16,
    paddingHorizontal: 12,
    paddingTop: 40,
    paddingBottom: 20,
  },
  animatedView: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
    marginTop: 20,
  },
  carouselDotsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  page: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
    marginTop: -2,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    transform: [{ translateY: 1 }],
    borderRadius: 8,
  },
  overlappingDot: {
    marginLeft: -10,
  }
});

export default styles;
