/**
 * Created by UR on 4/12/2018.
 */
define(function (require) {
    class User{
        constructor(userData){
            this.userID = userData.UserID;
            this.nick = userData.UserName;
            this.score = userData.Score;
            this.timesUpdate = userData.TimesUpdate;
            this.userType = userData.UserType;
            this.socket = null;
        }
        updateInfo(userData){
            this.userID = userData.UserID;
            this.nick = userData.UserName;
            this.score = userData.Score;
            this.timesUpdate = userData.TimesUpdate;
            this.userType = userData.UserType;
        }

    }

    return User;
})