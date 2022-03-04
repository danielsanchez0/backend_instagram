const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../keys")
const requireLogin = require("../middleware/requireLogin")
const nodemailer = require("nodemailer")
const sendgridTransport = require("nodemailer-sendgrid-transport")

const transporter = nodemailer.createTransport(sendgridTransport({
	auth:{
		api_key:"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"
	}
}))

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     description: Usado para solicitar crear un nuevo post.
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 *       422:
 *         description: El usuario no se ha creado, debe llenar todos los campos.
 *         type: json
 *       423:
 *         description: El usuario ya existe.
 *         type: json
 */
router.post('/signup',(req,res)=>{
	const {name,email,password,pic} = req.body;

	if(!email || !password || !name){
		res.status(422).json({error:"añade todos los campos, por favor"});
	}

	User.findOne({email:email}).then((savedUser)=>{
		if(savedUser){
			return res.status(423).json({error:"el usuario ya existe"});
		}

		bcrypt.hash(password,12).then(hashedpassword=>{
			const user = new User({
			email,
			password:hashedpassword,
			name,
			pic
		})

		user.save().then(user=>{

			transporter.sendMail({
				to:user.email,
				from:"daniel.1701610339@ucaldas.edu.co",
				subject:"signup success",
				html:"<h1>welcome to clone instagram</h1>"
			})

			res.status(201).json({message:"usuario guardado"});
		}).catch(err=>{
			console.log(err)
		})
	}).catch(err=>{
		console.log(err)
	})
	})

})

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     description: Usado para loguearse en el sistema.
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Usuario logueado correctamente.
 *         type: json
 *       405:
 *         description: Error de acceso, debe ingresar todos los datos.
 *         type: json
 *       422:
 *         description: El usuario no se ha logueado, contraseña incorrecta.
 *         type: json
 *       423:
 *         description: Contraseña incorrecta.
 *         type: json
 */
router.post('/signin',(req,res)=>{
	const {email,password} = req.body;

	if(!email || !password){
		return res.status(405).json({error:"incorrecto"})
	}

	User.findOne({email:email}).then(savedUser=>{
		if(!savedUser){
			return res.status(422).json({error:"email o contraseña invalidos"})
		}

		bcrypt.compare(password,savedUser.password).then(doMatch=>{
			if(doMatch){
				const token = jwt.sign({_id:savedUser._id},JWT_SECRET);
				const {_id,name,email,followers,following,pic} = savedUser
				res.status(201).json({token,user:{_id,name,email,followers,following,pic}})
			}else{
				return res.status(423).json({error:"contraseña incorrecta"})
			}
		}).catch(err=>{
			console.log(err)
		})
	})
})

module.exports = router;