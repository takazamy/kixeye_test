# KixEyeTest: LeaderBoardService
# Live Test Link: 
1. Application deployed on: http://kixeye.fungame.online:7002
2. DB has 1 users default: 1 admin
3. Accounts (username:password):
    - admin:123
# User Stories:
1. As a user I should be able to add/update a username and a score.
2. As a user I should be able to receive updates pushed to my screen when another user adds/updates their score.
3. As an administrator I should be able to see how many users updated their score in a time window.
4. As an administrator I should be able to see how many times a user updated their score.
5. As an administrator I should be able to delete a username and score.
# Ideas:
1. Use MySQL to store user infos.
2. Use NodeJS to create http and websocket server
3. Use HTML to create client
4. Use RequireJS to min project later

# RESTFul API:
### Start   
| Route | HTTP | Description |Params| Return |
| ------ | ------ |----------| -------|-------|
| /logout| POST| user log out| UserID|login page|

### User
|    Route  | HTTP | Description |Params| Return |
| --------- | ------ |----------| -------| -------|
| api/user/login| POST| user login| UserName, Password |Status 200 and data|
| api/user/register| POST| user register| UserName, Password |Status 200 and data|
| api/user/| GET| get user page| UserID | User Page|

### Admin
|    Route  | HTTP | Description |Params| Return |
| --------- | ------ |----------| -------| -------|
| api/admin/| GET|get  admin page| UserID | Admin Page|
  
# Socket
### User
|    Command  | Description |Params| Return |
| --------- | ----------| -------| -------|
| 1 | User update score| Command, UserID, Score| Status 1: OK (Command, UserID, UserName, Score, Status)|
| 1 | User update score| Command, UserID, Score| Status 0: Fail (Command, Status, Message)|
| 2 | User change name| Command, UserID, UserName| Status 1: OK (Command, UserID, UserName, Score, Status)|
| 2 | User change name| Command, UserID, UserName| Status 0: Fail (Command, Status, Message)|

### Admin
|    Command  | Description |Params| Return |
| --------- | ----------| -------| -------|
| 3 | Get All User Info| Command, UserID | Status 1: OK (Command, Data, Status)|
| 3 | Get All User Info| Command, UserID | Status 0: Fail (Command, Status, Message)|
| 4 | Delete A User| Command, UserID | Call Get All User Info|
| 5 | Get Log Number User Update At Period Time| Command, UserID, StartTime, EndTime  |  Status 1: OK (Command, Data, Status)|
| 5 | Get Log Number User Update At Period Time| Command, UserID, StartTime, EndTime  |  Status 0: Fail (Command, Status, Message)|

