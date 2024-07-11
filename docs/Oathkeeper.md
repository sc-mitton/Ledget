
# Oathkeeper

Oathkeeper is in the local dev environment as a access control decision point. It has it's own docker container it runs in. In the uat and prod environments, Oathkeeper works as a lambda custom authorizer. In order to test the golang code which constitutes the lambda custom authorizer, run the test script. The tests are also run during the CI process as well.

For debugging Oathkeeper, there is a debugging launch.json file already setup for vscode users. If the prelauch and postDebug tasks aren't working, you can run them manually before and after debugging (cmd+P > Tasks:Run Task).
