import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  devices: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
  },
  deviceIcon: {
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  device: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  deviceSummary: {},
  sessionsRow: {
    flexDirection: 'row',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: -4,
  },
  locationIcon: {
    marginBottom: 2,
  },
});

export default styles;
