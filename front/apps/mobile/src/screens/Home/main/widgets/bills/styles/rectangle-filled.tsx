import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    gap: 16,
  },
  leftColumn: {
    flex: 1,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  leftColumnInner: {
    minWidth: 75,
  },
  column: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1
  },
  calendar: {
    flex: 1.5,
    flexGrow: 1.5,
    gap: 8,
    marginRight: 4,
    flexDirection: 'row',
    height: '100%',
  },
  calendarCell: {
    borderRadius: 6,
    marginTop: -1
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  day: {
    position: 'relative',
    alignItems: 'center'
  },
  markersContainer: {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
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
  }
});

export default styles;
