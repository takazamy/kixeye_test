/**
 * Created by UR on 4/3/2018.
 */
define(function (require) {

    var Logger = require('../Modules/Logger');
    var db =require('../Database/DBService');
    var User = require('../Model/User');
    class SocketController{
        constructor(server ,socket){
            this.server = server;
            this.socket = socket;
        }
        handleMessage(req, message){
            try{
                console.log('SocketController handleMessage', JSON.parse(message));
                var Msg = JSON.parse(message);
                switch (Msg.Command){
                    case 1:
                        this.userUpdateScore(Msg,req);
                        break;
                    case 2:
                        this.userChangeName(Msg,req);
                        break;
                    case 3:
                        if(this.socket.userType == 1)
                            this.getUserInfo(Msg,req);
                        break;
                    case 4:
                        if(this.socket.userType == 1)
                            this.deleteUser(Msg);
                        break;
                    case 5:
                        if(this.socket.userType == 1)
                            this.getLog(Msg,req);
                        break;
                        break;
                    default:
                        break;
                }
            }catch(e){
                Logger.Default().error('handleMessage ',message,e);
            }

        }
        getLog(data){
            var startTime = data.StartTime;
            var endTime  = data.EndTime;
            db.getLog(startTime,endTime).then(function (rows) {

                var msg = {Command: 5, Data:rows[0], Status: 1};
                this.socket.send(JSON.stringify(msg))

            }.bind(this)).catch(function (err) {
                Logger.DataBase().error('get Log err',err);
                var msg = {Command: 5, Status: 0, Message: 'Get Log Fail'};
                this.socket.send(JSON.stringify(msg))
            })
        }
        deleteUser(data){
            db.removeUserByID(data.UserID).then(function () {
                this.getUserInfo();
            }.bind(this))
        }
        getUserInfo(){
            db.getUsers().then(function (rows) {
                var msg = {Command: 3, Data:rows, Status: 1};
                this.socket.send(JSON.stringify(msg))
            }.bind(this)).catch(function (err) {
                Logger.Default().error('getUserInfo ',err);
                var msg = {Command: 3, Status: 0, Message: 'Get Info Fail'};
                this.socket.send(JSON.stringify(msg))
            })
        }

        userUpdateScore(data,req){
            var userID = data.UserID;
            var score  = data.Score;
            console.log('Update Score',data);
            db.updateUserScore(userID,score).then(function (rows) {
                console.log(rows);
                if (rows && rows.length > 0 && rows[0].result > 0) {
                    var userData = rows[0];

                    const ApiLeaderBoard = require('../ApiLeaderBoard');
                    var user = new User(userData);
                    req.session.userData = userData;
                    ApiLeaderBoard.updateInfo(userData);
                    var msg = {Command: 1, UserID: user.userID, UserName: user.nick, Score:user.score, Status: 1};
                    ApiLeaderBoard.wss.broadcast(JSON.stringify(msg));
                }
                else {
                    var msg = {Command: 1, Status: 0, Message: 'Update Score Fail'};
                    this.socket.send(JSON.stringify(msg))
                }

            }.bind(this)).catch(function (err) {
                console.log(err);
                var msg = {Command: 1, Status: 0, Message: 'Update Score Fail'};
                this.socket.send(JSON.stringify(msg))

            });
        }
        userChangeName(data,req){
            var userID = data.UserID;
            var userName = data.UserName;
            db.updateUserName(userID,userName).then(function (rows) {
                console.log(rows);
                if (rows && rows.length > 0 && rows[0].result > 0) {
                    var userData = rows[0];

                    const ApiLeaderBoard = require('../ApiLeaderBoard');
                    var user = new User(userData);
                    req.session.userData = userData;
                    ApiLeaderBoard.updateInfo(userData);
                    var msg = {Command: 2, UserID: user.userID, UserName: user.nick, Score:user.score, Status: 1};
                    this.socket.send(JSON.stringify(msg));
                }
                else {
                    var msg = {Command: 2, Status: 0, Message: 'Update Name Fail'};
                    this.socket.send(JSON.stringify(msg));
                }

            }.bind(this)).catch(function (err) {
                console.log(err);
                var msg = {Command: 2, Status: 0, Message: 'Update Name Fail'};
                this.socket.send(JSON.stringify(msg));

            });
        }
    }

    return SocketController;
});