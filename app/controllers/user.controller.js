const db = require("../models");
const User = db.users;
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