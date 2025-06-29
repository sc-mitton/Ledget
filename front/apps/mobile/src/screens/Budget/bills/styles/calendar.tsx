import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -6,
  },
  title: {},
  column: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendar: {
    marginTop: 8,
    paddingHorizontal: 4,
    paddingVertical: 12,
    gap: 12,
    height: Dimensions.get('window').width * 0.75,
  },
  calendarCell: {
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 6,
  },
  day: {
    position: 'relative',
    alignItems: 'center',
  },
  markersWrapper: {
    width: 1,
    height: 1,
  },
  markersContainer: {
    position: 'absolute',
    left: '50%',
    bottom: -6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markers: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  marker: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default styles;
