import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    overflow: 'hidden',
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
    alignItems: 'center'
  },
  measuringPage: {
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
  }
});

export default styles;
