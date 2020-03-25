# A Full-Stack Project based on MERN 

## Front End: ReactJS, AntD-UI, Less.      BackEnd: NodeJS(Express) 

- Designed to help people find jobs, where all recruiters and job seekers can sign up and chat online instantly, based on MERN(MongoDB, Express, React&Redux, NodeJS) stack, and deployed on Heroku.
- Leveraged AntD-UI and React to design the UI components in client end, and Express in server end. 
- Accomplished asynchronous interactions with Await&Async and utilized Redux for state management. 
- Set up project routes by react-router-dom and chat online instantly by Socket.io.

### This is the deploy version of this project, for source codes, please look at repository called MERN-Project. 


# API documents


## 1、Register

### Request URL：

	localhost:3005/register

### Request Method：

	POST

### Argument type

	|Argument    |Not Null |Type     |Description
	|username    |Y        |string   |UserName
	|password    |Y        |string   |Password
	|type        |Y        |string   |Type

### Example of response：

	Success:
	    {
	      "code": 0,
	      "data": {
	        "_id": "5ae133e621388d262c8d91a6",
	        "username": "ds2",
	        "type": "dashen"
	      }
	    }
	Fail
	    {
	      "code": 1,
	      "msg": "User Exists"
	    }


## 2、Login

### Request URL：

	localhost:3005/login

### Request Method：

	POST

### Argument type:

	|Argument    |Not Null |Type     |Description
	|username    |Y        |string   |UserName
	|password    |Y        |string   |Password

### Example of response：

	Success:
	    {
	      "code": 0,
	      "data": {
	        "_id": "5ae1338a21388d262c8d91a5",
	        "username": "ds1",
	        "type": "dashen",
	        "__v": 0
	      }
	    }
	Fail
	    {
	      "code": 1,
	      "msg": "invalid username or password"
	    }

## 3、Update User Infomation

### Request URL：

	localhost:3005/update

### Request Method：

	POST

### Argument Type：

	|Argument  |Not Null |Type     |Description
	|header    |Y        |string   |头像名称
	|info      |N        |string   |介绍
	|post      |N        |string   |职位
	|salary    |N        |string   |月薪
	|company   |N        |string   |公司

### Example of response：

	Success:
	    {
		    "code": 0,
		    "data": {
		        "header": "头像2",
		        "info": "react/vue",
		        "post": "前端工程师",
		        "company": "Oracle",
		        "salary": "18K",
		        "_id": "5ae1f088d37a442b749fc143",
		        "username": "laoban1",
		        "type": "laoban"
		    }
		}
	Fail
	    {
	      "code": 1,
	      "msg": "please log in"
	    }


## 4、Get the current user based on cookie

### Request URL：

	localhost:3005/user

### Request Method：

	GET

### Argument Type

	None

### Example of response：

	Success:
	    {
		    "code": 0,
		    "data": {
		        "_id": "5ae1f088d37a442b749fc143",
		        "username": "laoban1",
		        "type": "laoban",
		        "__v": 0,
		        "salary": "18K",
		        "company": "Oracle",
		        "post": "前端工程师",
		        "info": "react/vue",
		        "header": "头像2"
		    }
		}
	Fail
	    {
	      "code": 1,
	      "msg": "please log in"
	    }


## 5、Get user lists

### Request URL：

	localhost:3005/userlist

### Request Method：

	GET

### Argument Type: query

	|Argument   |Not Null |Type     |Description
	|type       |Y        |string   |Type(dashen/laoban)

### Example of response：

	{
	    "code": 0,
	    "data": [
	        {
	            "_id": "5ae1d5d19151153d30e008fd",
	            "username": "ds2",
	            "type": "dashen",
	            "__v": 0
	        },
	        {
	            "_id": "5ae1ddd99ca58023d82351ae",
	            "username": "aa",
	            "type": "dashen",
	            "__v": 0,
	            "post": "前端工程师",
	            "info": "Rect/Vue",
	            "header": "头像1"
	        }
	    ]
	}


## 6、Get message lists of current user

### Request URL：

	localhost:3005/msglist

### Request Method：

	GET

### Argument Type

	None

### Example of response：

	{
	    "code": 0,
	    "data": {
	        "users": {
	            "5ae1d5d19151153d30e008fd": {
	                "username": "ds2"
	            },
	            "5ae1ddd99ca58023d82351ae": {
	                "username": "aa",
	                "header": "头像1"
	            },
	            "5ae1df049ca58023d82351af": {
	                "username": "aa2"
	            },
	            "5ae1e72aa072c522e024b18e": {
	                "username": "bb",
	                "header": "头像3"
	            },
	            "5ae1f088d37a442b749fc143": {
	                "username": "laoban1",
	                "header": "头像2"
	            }
	        },
	        "chatMsgs": [
				{
	                "read": false,
	                "_id": "5ae1f3c3a95eb824841199f1",
	                "from": "5ae1f088d37a442b749fc143",
	                "to": "5ae1ddd99ca58023d82351ae",
	                "content": "aa",
	                "create_time": 1524757443374,
	                "__v": 0
	            }
			]
	    }
	}

## 7、 Change the status of message to read

### Request URL：

	localhost:3005/readmsg

### Request Method：

	post

### Argument Type

	|Argument   |Not Null |Type     |Description
	|from       |Y        |string   |发送消息用户的id

### Example of response：

	{code: 0, data: 2}
