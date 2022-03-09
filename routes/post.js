const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");

/**
 * @swagger
 * /post/allpost:
 *   get:
 *     description: Usado para solicitar la lista total de preguntas realizadas por los usarios.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Retorna la información de usuario correspondiente al ID proporcionado.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 */
router.get('/allpost',(req,res)=>{
	Post.find()
	.populate("postedBy","_id name")
	.populate("comments.postedBy","_id name")
	.sort("-createdAt")
	.then(posts=>{
		res.status(200).json({posts})
	}).catch(err=>{
		console.log(err);
	})
})

/**
 * @swagger
 * /post/getsubpost:
 *   get:
 *     description: Usado para solicitar la lista total de preguntas realizadas por los usarios a los que se sigue.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Retorna la información de usuario correspondiente al ID proporcionado.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 */
router.get('/getsubpost',requireLogin,(req,res)=>{
	Post.find({postedBy:{$in:req.user.following}})
	.populate("postedBy","_id name")
	.populate("comments.postedBy","_id name")
	.sort("-createdAt")
	.then(posts=>{
		res.status(200).json({posts})
	}).catch(err=>{
		console.log(err);
	})
})

/**
 * @swagger
 * /post/mypost:
 *   get:
 *     description: Usado para solicitar la lista total de preguntas realizadas por el usuario logueado.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Retorna la información de usuario correspondiente al ID proporcionado.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 */
router.get('/mypost',requireLogin,(req,res)=>{
	Post.find({postedBy:req.user._id})
	.populate("postedBy","_id name")
	.then(myposts=>{
		res.status(200).json({myposts})
	}).catch(err=>{
		console.log(err);
	})
})

/**
 * @swagger
 * /post/createpost:
 *   post:
 *     description: Usado para solicitar crear un nuevo post.
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Post creado correctamente.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 *       422:
 *         description: El post no se ha creado, debe llenar todos los campos.
 *         type: json
 */
router.post('/createpost',requireLogin,(req,res)=>{
	const {title,body,pic} = req.body;

	if(!title || !body || !pic){
		return res.status(422).json({error:"por favor, llena todos los campos"})
	}

	req.user.password = undefined;
	const post = new Post({
		title,
		body,
		photo: pic,
		postedBy:req.user
	})

	post.save().then(result=>{
		res.status(201).json({post:result})
	}).catch(err=>{
		console.log(err);
	})
})

/**
 * @swagger
 * /post/like:
 *   put:
 *     description: Usado para solicitar agregar un like a un post.
 *     produces:
 *       - application/json
 *     responses:
 *       203:
 *         description: Like agregado correctamente.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 *       422:
 *         description: Error de procesamiento de datos.
 *         type: json
 */
router.put('/like',requireLogin,(req,res)=>{
	Post.findByIdAndUpdate(req.body.postId,{
		$push:{likes:req.user._id},},{
			new: true
	}).exec((err,result)=>{
		if(err){
			return res.status(422).json({error:err})
		} else{
			res.status(203).json(result)
		}
	})
})

/**
 * @swagger
 * /post/unlike:
 *   put:
 *     description: Usado para solicitar quitar un like a un post.
 *     produces:
 *       - application/json
 *     responses:
 *       203:
 *         description: Like quitado correctamente.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 *       422:
 *         description: Error de procesamiento de datos.
 *         type: json
 */
router.put('/unlike',requireLogin,(req,res)=>{
	Post.findByIdAndUpdate(req.body.postId,{
		$pull:{likes:req.user._id},},{
			new: true
	}).exec((err,result)=>{
		if(err){
			return res.status(422).json({error:err})
		} else{
			res.status(203).json(result)
		}
	})
})

/**
 * @swagger
 * /post/comment:
 *   put:
 *     description: Usado para solicitar agregar un comentario a un post.
 *     produces:
 *       - application/json
 *     responses:
 *       203:
 *         description: Comentario agregado correctamente.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 *       422:
 *         description: Error de procesamiento de datos.
 *         type: json
 */
router.put('/comment',requireLogin,(req,res)=>{
	const comment = {
		text:req.body.text,
		postedBy: req.user._id
	}

	Post.findByIdAndUpdate(req.body.postId,{
		$push:{comments:comment}},{
			new: true
	})
	.populate("comments.postedBy","_id name")
	.populate("postedBy","_id name")
	.exec((err,result)=>{
		if(err){
			return res.status(422).json({error:err})
		} else{
			res.status(203).json(result)
		}
	})
})

/**
 * @swagger
 * /post/delete/{postId}:
 *   delete:
 *     description: Usado para solicitar eliminar post.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: postId
 *         description: ID de un post.
 *     responses:
 *       204:
 *         description: Post eliminado correctamente.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 *       422:
 *         description: Error de procesamiento de datos.
 *         type: json
 */
router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
	Post.findOne({_id:req.params.postId})
	.populate("postedBy","_id")
	.exec((err,post)=>{
		if(err || !post){
			return res.status(422).json({error:err})
		}
		if(post.postedBy._id.toString() === req.user._id.toString()){
			post.remove()
			.then(result=>{
				res.status(204).json(result)
			}).catch(err=>{
				console.log(err)
			})
		}
	})
})

module.exports = router;