import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -6,
  },
  column: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendar: {
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 10,
    height: Dimensions.get('window').width * 0.625,
  },
  calendarCell: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 12,
  },
  day: {
    position: 'relative',
    alignItems: 'center',
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
