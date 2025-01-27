import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  subHeader: {
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '66%',
    gap: 12,
  },
  buySellIconContainer: {
    position: 'absolute',
    left: -16,
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buySellIcon: {
    position: 'absolute',
  },
  section: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  name: {
    flexWrap: 'wrap',
    maxWidth: '60%',
  },
  leftColumn: {
    marginRight: 16,
  },
});

export default styles;
