# incode-test-task

## In order to start the application, please configure env variables such as:
- DB_CONNECT_URL - MongoDB URL
- SESSION_SECRET - session secret
### ALSO: there's no way of creating admin user through the application yet. You can add it manually for the FIRST TIME. To do so:
- comment "requireAuth" middleware on "create" route
- it's also recommended to comment "parent: req.session.user," line in the UserController.create() function.

Enjoy!
