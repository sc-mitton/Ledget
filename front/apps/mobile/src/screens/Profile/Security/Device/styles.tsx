import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexShrink: 0,
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 74,
  },
  pcIcon: {
    marginTop: -8
  },
  mobileIcon: {
    marginTop: 4,
    marginBottom: 8
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  boxHeader: {
    flexDirection: 'row',
    paddingLeft: 2,
    justifyContent: 'flex-start',
  },
  mobileLocation: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center'
  },
  pcLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  logoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessions: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxHeight: '60%'
  },
  sessionsScroll: {
    width: '107%',
    paddingRight: 20,
    flexDirection: 'column',
  },
  headers: {
    flexDirection: 'row',
  },
  familyHeader: {
    flex: 1,
  },
  lastLoginHeader: {
    flex: 2,
  },
  session: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  row: {
    flex: 1,
  },
  family: {
    flex: 1,
  },
  lastLogin: {
    flex: 2,
  },
});
