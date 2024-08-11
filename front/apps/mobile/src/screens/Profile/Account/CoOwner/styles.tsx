import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 64,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 4
  },
  header: {
    marginTop: 16,
    marginBottom: 0
  },
  container: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  accountsContainer: {
    gap: 4,
  },
  accounts: {
    marginVertical: 8,
    marginLeft: 4,
    flexDirection: 'row',
  },
  emptyAccounts: {
    marginVertical: 2
  },
  logo: {
    marginLeft: -4
  },
  removeButton: {
    alignItems: 'center',
    gap: 4,
    marginLeft: 16,
    marginTop: 6,
    flexDirection: 'row',
  }
});
