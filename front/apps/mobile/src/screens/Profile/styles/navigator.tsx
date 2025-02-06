import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  full: {
    flex: 1,
  },
  header: {
    paddingBottom: 8,
  },
  scrollView: {
    position: 'relative',
  },
  animatedHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: '100%',
    overflow: 'hidden',
  },
  userInfo: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column',
  },
  optionsContainer: {
    flexDirection: 'column',
    marginTop: 20,
    gap: 8,
    paddingVertical: 16,
  },
  logoutButton: {
    marginLeft: 4,
    gap: 8,
  },
  logoutIcon: {
    marginLeft: 8,
  },
});
