import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabsTrack: {
    marginBottom: 8,
    maxWidth: '70%',
  },
  boxesContainer: {
    flex: 1,
    marginTop: -6,
    justifyContent: 'center',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tabButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    marginTop: 24,
    justifyContent: 'center',
  },
  tabPanel: {
    flex: 1,
  },
});

export default styles;
