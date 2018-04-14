# KIXEYETEST: Setup Intruction

# MySQL
### Install MySQL Server
### Create database **kixeyeuser**
Create table **user**
- UserID INT(11) is PK and AI
- UserName Varchar(45) Default NULL
- Password Varchar(50) Default NULL
- Score INT(11) Default 0
- TimesUpdate INT(11) Default 0
- UserType INT(11) Default 0
- CreateDate DateTime Default Now()
- ModifiedDate DateTime Default NULL
## Insert Admin
Insert user admin set UserType = 1, Password encrypt MD5
### Create MySQL User have right on **_kixeyeuser_**
### Create Procedures
```sh
DELIMITER $$
CREATE DEFINER=`user`@`%` PROCEDURE `prc_checkLogin`(
IN userName_input varchar(45),
IN pw_input varchar(50)
)
BEGIN
	SET @res = 0;
    SET @desc = '';
	set @stt = (select UserID from user where UserName like userName_input and PW like pw_input);
	IF @stt IS NOT NULL Then
		set @res = 1;		
        SELECT @res as result,@desc as description, UserID, UserName, Score, TimesUpdate, UserType 
        FROM user  where UserName like userName_input and PW like pw_input;
	ELSE
		SET @desc = 'Login Fail';
		SELECT @res as result,@desc as description;
	end if;
    
    -- SELECT UserID, UserName, Score, TimesUpdate, UserType 
    --    FROM user  where UserName like userName_input and PW like pw_input;
END$$
DELIMITER ;
```
```sh
DELIMITER $$
CREATE DEFINER=`user`@`%` PROCEDURE `prc_createNewUser`(
IN userName_input varchar(45),
IN pw_input varchar(50)
)
BEGIN
	set @res = 0;
    set @desc = '';
    set @stt = (select UserID from user where UserName like userName_input);
    IF @stt IS NOT NULL Then
		set @res = 0;
        set @desc = 'User exits';		
        
	ELSE
		set @res = 1;
		Insert Into kixeyeuser.user(UserName, PW)
		Values(userName_input, pw_input);
	end if;
	
    
    SELECT @res as result,@desc as description, UserID, UserName, Score, TimesUpdate, UserType  FROM user  where UserName like userName_input;
    
END$$
DELIMITER ;
```
```sh
DELIMITER $$
CREATE DEFINER=`user`@`%` PROCEDURE `prc_getUser`()
BEGIN
	select UserID, UserName, Score, TimesUpdate, UserType from user where UserType != 1;
END$$
DELIMITER ;
```
```sh
DELIMITER $$
CREATE DEFINER=`user`@`%` PROCEDURE `prc_getLog`(
IN start_input datetime,
IN end_input datetime)
BEGIN
	select Count(*) as Count from user where ModifiedDate >= start_input and ModifiedDate <= end_input;
END$$
DELIMITER ;
```
```sh
DELIMITER $$
CREATE DEFINER=`user`@`%` PROCEDURE `prc_removeUserByID`(
IN userID_input INT(11))
BEGIN
	DELETE FROM user 
    WHERE UserID = userID_input and UserID = userID_input and UserType != 1;
END$$
DELIMITER ;
```
```sh
DELIMITER $$
CREATE DEFINER=`user`@`%` PROCEDURE `prc_updateUserName`(
IN userID_input INT(11),
IN name_input VarChar(45)
)
BEGIN
	SET @res = 0;
    SET @desc = '';
	set @stt = (select UserID from user where UserID = userID_input);
	IF @stt IS NOT NULL Then
		set @res = 1;
		UPDATE user SET UserName = name_input
		where UserID = userID_input;
        SELECT @res as result,@desc as description, UserID, UserName, Score, TimesUpdate, UserType FROM user  where UserID = userID_input;
	ELSE
		SET @desc = 'user is not exist';
		SELECT @res as result,@desc as description;
	end if;
END$$
DELIMITER ;
```
```sh
DELIMITER $$
CREATE DEFINER=`user`@`%` PROCEDURE `prc_userUpdateScore`(
IN userID_input INT(11),
IN score_input INT(11)
)
BEGIN
	SET @res = 0;
    SET @desc = '';
	set @stt = (select UserID from user where UserID = userID_input);
	IF @stt IS NOT NULL Then
		set @res = 1;
		UPDATE user SET Score = score_input,
        TimesUpdate = TimesUpdate +1,
        ModifiedDate = Now()
		where UserID = userID_input;
        SELECT @res as result,@desc as description, UserID, UserName, Score, TimesUpdate, UserType  FROM user  where UserID = userID_input;
	ELSE
		SET @desc = 'user is not exist';
		SELECT @res as result,@desc as description;
	end if;
END$$
DELIMITER ;
```
# NodeJS
- Setup NodeJS 
- Setup modules, at the director have package.json file call:
    ```sh    
    $ npm install
    ```
- Update Port in **_index.js_** of **Config** director
- Update MySQL Server config in **_index.js_** of  **Config** director

# Run
Have 2 ways:
- go to director has **package.json** file
```sh
$ npm start
```
- go to director **src** has **main.js** file
```sh
$ node main.js
```
