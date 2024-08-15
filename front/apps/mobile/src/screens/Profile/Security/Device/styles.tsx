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
    marginTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mobileLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pcLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessions: {
    flexDirection: 'column',
    maxHeight: '60%'
  },
  sessionsScroll: {
    width: '107%',
    paddingHorizontal: 16,
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
