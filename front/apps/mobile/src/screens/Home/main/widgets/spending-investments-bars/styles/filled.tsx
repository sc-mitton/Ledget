import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  accountsCarousel: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItem: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 2,
  },
  dateIndicator: {
    width: '100%',
    alignItems: 'center',
    marginBottom: -5,
  },
  dateIndicatorIcon: {
    marginBottom: -2,
    marginTop: 2,
  },
  rectangleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    justifyContent: 'space-between',
    height: '100%',
  },
  fontStyle: {
    fontFamily: 'SourceSans3Regular',
    fontSize: 15,
  },
  largeFontStyle: {
    fontFamily: 'SourceSans3SemiBold',
    fontSize: 22,
  },
  bar: {
    width: 5,
    borderRadius: 5,
  },
  rectangleLeftSide: {
    justifyContent: 'center',
    gap: 12,
    alignItems: 'center',
    height: '100%',
    flexGrow: 2,
    flex: 2,
  },
  rectangleRightSide: {
    flexGrow: 2.5,
    flex: 2.5,
    paddingVertical: 6,
  },
  bottomHalf: {
    flexGrow: 1,
    flex: 1,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  incomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: -2,
  },
  rectangleLeftBottom: {
    gap: 18,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default styles;
