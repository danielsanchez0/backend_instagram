const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

/**
 * @swagger
 * /user/stats:
 *   get:
 *     description: Retorna la lista de usuarios con la información correspondiente a su id,nombre,url de su foto de perfil y cantidad de posts realizados, en orden respecto a la cantidad de posts.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Retorna un json con la información solicitada correctamente.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 */
router.get('/stats',requireLogin,(req,res)=>{
	User.aggregate([{ "$lookup": {
     "from": "posts",
     "foreignField": "postedBy",
     "localField": "_id",
     "as": "preguntas"
   }},
   {
     "$unwind": "$preguntas"
   },
   {
     $group : {_id:{id:"$_id",name:"$name",pic:"$pic"}, count:{$sum:1}}
   },
   {
       $sort: {count: -1}
   }])
	.then(posts=>{
		res.status(200).json({posts})
	}).catch(err=>{
		console.log(err);
	})
})

/**
 * @swagger
 * /user/user/{id}:
 *   get:
 *     description: Usada para solicitar la información de usuario a traves de su ID de identificación.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de un usuario
 *     responses:
 *       200:
 *         description: Retorna la información de usuario correspondiente al ID proporcionado.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 *       404:
 *         description: No existe usuario correspondiente al ID proporcionado.
 *         type: json
 *       422:
 *         description: Error de validación de los datos.
 *         type: json
 */
router.get('/user/:id',requireLogin,(req,res)=>{
	User.findOne({_id:req.params.id})
	.select("-password").
	then(user=>{
		Post.find({postedBy:req.params.id})
		.populate("postedBy","id _name")
		.exec((err,posts)=>{
			if(err){
				return res.status(422).json({error:err})
			}

			res.status(200).json({user,posts})
		})
	}).catch(err=>{
		return res.status(404).json({error:"user not found"})
	})
})

/**
 * @swagger
 * /user/follow:
 *   put:
 *     description: Usada para solicitar agregar un nuevo usuario a la lista de usuarios seguidos.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: followId
 *         description: ID del usuario que deseamos seguir.
 *     responses:
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 *       422:
 *         description: Error de validación de los datos.
 *         type: json
 */
router.put('/follow',requireLogin,(req,res)=>{
	User.findByIdAndUpdate(req.body.followId,{
		$push:{followers:req.user._id}
	},{
		new:true
	},(err,result)=>{
		if(err){
			return res.status(422).json({error:err})
		}

		User.findByIdAndUpdate(req.user._id,{
			$push:{following:req.body.followId}
		},{new:true}).select("-password").then(resultado=>{
			res.json(resultado)
		}).catch(errorprocess=>{
			return res.status(422).json({error:errorprocess})
		})

	})
})

/**
 * @swagger
 * /user/unfollow:
 *   put:
 *     description: Usada para solicitar quitar un usuario de la lista de usuarios seguidos.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: unfollowId
 *         description: ID del usuario que deseamos dejar de seguir.
 *     responses:
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 *       422:
 *         description: Error de validación de los datos.
 *         type: json
 */
router.put('/unfollow',requireLogin,(req,res)=>{
	User.findByIdAndUpdate(req.body.unfollowId,{
		$pull:{followers:req.user._id}
	},{
		new:true
	},(err,result)=>{
		if(err){
			return res.status(422).json({error:err})
		}

		User.findByIdAndUpdate(req.user._id,{
			$pull:{following:req.body.unfollowId}
		},{new:true}).select("-password").then(resultado=>{
			res.json(resultado)
		}).catch(errprocess=>{
			return res.status(422).json({error:errprocess})
		})

	})
})

/**
 * @swagger
 * /user/updatepic:
 *   put:
 *     description: Usada para actializar el enlace de la foto de perfil.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: pic
 *         description: Enlace de la foto de perfil.
 *     responses:
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 *       422:
 *         description: Error de validación de los datos.
 *         type: json
 */
router.put('/updatepic',requireLogin,(req,res)=>{
	User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},
		{new:true},

		(err,result)=>{
			if(err){
				return res.status(422).json({error:"pic cannot post"})
			}
			res.json(result)
	})
})

module.exports = router;