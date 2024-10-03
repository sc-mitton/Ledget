import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  box: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  container: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
    marginTop: 20,
  },
  carouselDotsContainer: {
    flexDirection: 'row',
    marginVertical: 12,
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
  }
});

export default styles;
