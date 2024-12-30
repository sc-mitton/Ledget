import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 6,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2
  },
  pagerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  pagerView: {
    flexGrow: 1,
    flex: 1,
  },
  calendarIcon: {
    marginRight: 0,
    marginBottom: 2
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'space-between',
  },
  column: {
    gap: 24,
    justifyContent: 'space-between',
  },
  title: {
    alignItems: 'center',
    marginBottom: 4
  },
  arrowButton: {
    transform: [{ scaleY: 1.2 }],
    opacity: .5
  }
});

export default styles;
