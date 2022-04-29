const db = require("../models");
const User = db.users;
const Invoice = db.invoices;
const Account = db.accounts;
const Project = db.projects;
const UserProject = db.user_projects;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');
const emailCheck = require('email-check');

exports.register = async (req, res) => {
	  // Validate request
	  if (!req.body.name) {
	    return res.status(400).send({
	      message: "Name can not be empty!"
	    });
	  }
	  if (!req.body.email) {
	    return res.status(400).send({
	      message: "Email can not be empty!"
	    });
	  }
	  if (!req.body.password) {
	    return res.status(400).send({
	      message: "Password can not be empty!"
	    });
	  }

	  emailCheck(req.body.email)
	  	.then(async function (result) {
		  	if(!result){
		  		return res.status(500).send({message:"Email is not available."});
		  	}else{
		  		await User.findOne({ where: {email:req.body.email} })
			    .then(async user => {
			      if (user) {
			       	return res.status(500).send({message:"Email already exists."});
			      }else{
			  		//Encrypt user password
			  		encryptedPassword = await bcrypt.hash(req.body.password, 10);	

				  	// Create a User
					const user = {
					    name: req.body.name,
					    email: req.body.email,
					    password: encryptedPassword,
					    status: req.body.status ? req.body.status : false
					};
	  	
			  	   	// Save User in the database
				   	User.create(user)
				    .then(data => {
					    res.status(200).send({message:"User registered successfully.", "user" : user});
				    })
				    .catch(err => {
				      return res.status(500).send({
				        message:
				          err.message || "Some error occurred while creating the User."
				      });
			  		});			      	
			      }
			    })
			    .catch(err => {
			      return res.status(500).send({
			        message: err.message
			      });
			    });
			}
		})
	  	.catch(function (err) {
		    if (err.message === 'refuse') {
		      return res.status(500).send({message:err.message});
		    } else {
		      return res.status(500).send({message:err.message});
		    }
	  	});
};

exports.addUserProject = async (req, res) => {

	if (!req.body.project_id) {
	    return res.status(400).send({
	      message: "Project Id can not be empty!"
	    });
	}
	if (!req.body.user_id) {
	    return res.status(400).send({
	      message: "User Id can not be empty!"
	    });
	}

	const userProject = {
	    project_id: req.body.project_id,
	    user_id: req.body.user_id,
	};
	
   	UserProject.create(userProject)
    .then(data => {
	    res.status(200).send({message:"User Project added successfully.", "userProject" : userProject});
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred!"
      });
	});		
};

exports.oneToOne = async (req, res) => {
	if (!req.body.email) {
	    return res.status(400).send({
	      message: "Email can not be empty!"
	    });
	}

	User.findOne({
		include: ['account'], 
		where: {email:req.body.email}
	})
	.then((data) => {
	  return res.status(200).send({
        message: "success!",
        data:data
        // data:data.get().invoices
      });
	})
	.catch((err) => {
		return res.status(500).send({
	        message: err.message,
	    });
	})

	/*Account.findOne({
		include: ['user'], 
		where: {user_id:1}
	})
	.then((data) => {
	  return res.status(200).send({
        message: "success!",
        data:data
      });
	})
	.catch((err) => {
		return res.status(500).send({
	        message: err.message,
	    });
	})*/
};

exports.oneToMany = async (req, res) => {
	if (!req.body.email) {
	    return res.status(400).send({
	      message: "Email can not be empty!"
	    });
	}

	/*User.findByPk(1, {include: ['invoices']})
	.then((data) => {
	  return res.status(200).send({
        message: "success!",
        data:data
        //data:data.get().invoices
      });
	})
	.catch((err) => {
		return res.status(500).send({
	        message: err.message,
	    });
	})*/

	User.findOne({
		include: ['invoices'], 
		where: {email:req.body.email}
	})
	.then((data) => {
	  return res.status(200).send({
        message: "success!",
        data:data
        // data:data.get().invoices
      });
	})
	.catch((err) => {
		return res.status(500).send({
	        message: err.message,
	    });
	})

	/*Invoice.findAll({
		include: ['users'], 
		where: {user_id:1}
	})
	.then((data) => {
	  return res.status(200).send({
        message: "success!",
        data:data
      });
	})
	.catch((err) => {
		return res.status(500).send({
	        message: err.message,
	    });
	})*/
};

exports.ManyToMany = async (req, res) => {
	if (!req.body.email) {
	    return res.status(400).send({
	      message: "Email can not be empty!"
	    });
	}

	/*User.findAll({
		include: ['projects'], 
		where: {email:req.body.email}
	})
	.then((data) => {
	  return res.status(200).send({
        message: "success!",
        data:data
      });
	})
	.catch((err) => {
		return res.status(500).send({
	        message: err.message,
	    });
	})*/

	Project.findAll({
		include: [
			{
				model: User,
				as: 'users',
				where: {email:req.body.email}
			}
		],
		order: [
            ['id', 'DESC']
        ]
	})
	.then((data) => {
	  return res.status(200).send({
        message: "success!",
        data:data
      });
	})
	.catch((err) => {
		return res.status(500).send({
	        message: err.message,
	    });
	})
};

