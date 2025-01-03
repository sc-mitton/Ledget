import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabsContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  tabsContent: {
    maxWidth: '55%',
  },
  container: {
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  inputButton: {
    marginTop: 2,
  },
  inputs: {
    marginTop: 16,
  },
  calendarIcon: {
    marginRight: 8,
  },
  dayCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
    marginBottom: 12,
  },
  column: {
    gap: 20,
    flex: 1,
    alignItems: 'center',
  },
  dayCell: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayIndicatorBoxContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  dayIndicatorBox: {
    width: 40,
    height: 40,
    position: 'absolute',
  },
  months: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 8,
  },
  month: {
    marginVertical: 4,
    paddingHorizontal: 4,
  },
  weeks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 16,
    gap: 16,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 4,
  },
});

export default styles;
