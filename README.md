# kixeye_test: LeaderBoard Service

#Live test link:
Application deployed on: https://kixeye-test-2.herokuapp.com
DB has 5 users default: 1 admin, 4 users
Accounts (username:password):
admin:123
user11:123
user2:123
user3:123
user4:123
User Stories:
As a user I should be able to add/update a username and a score.
As a user I should be able to receive updates pushed to my screen when another user adds/updates their score.
As an administrator I should be able to see how many users updated their score in a time window.
As an administrator I should be able to see how many times a user updated their score.
As an administrator I should be able to delete a username and score.
Ideas:
Use Redis to cache User data to prevent heavy load on main db (MongoDB at this case).
Use Redis sorted set for storing score. It helps get user rank faster than db query.
User Redis sorted set for storing user score update timeline.
Use Redis Pub/Sub pattern. This helps Server-To-Server Communication. We can run many service server but want to publish events to all.
Use Redis to store top users with specified expire times (not use yet).
RESTFul API
Every responses with status code not 200 (SUCCESS) will have an error field in json response

User
Route	HTTP	Description	Params	Return
/api/user/login	POST	login	userName, password	200: OK, 500: Fail
/api/user	PUT	change user name	userName	200: OK, 500: Fail
/api/user/score	POST	submit score	score	200: OK, 500: Fail
Admin
Route	HTTP	Description	Params	Return
/api/admin/:uid/score	GET	Get user current score	uid: String	200: OK, 500: Fail
/api/admin/users	GET	Get all normal users		200: OK, 500: Fail
/api/admin/scores	GET	Get user score update time line	from, to: Date time string	200: OK, 500: Fail
Dev
Route	HTTP	Description	Params	Return
/dev/users	PUT	Init user list		200: OK, 500: Fail
/dev/users	DELETE	Clear all users		200: OK, 500: Fail