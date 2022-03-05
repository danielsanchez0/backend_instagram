const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Entry = mongoose.model("Entry");

/**
 * @swagger
 * /entry/allentries:
 *   get:
 *     description: Retorna la lista de entradas.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: La información solicitada fue entregada correctamente.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 */
router.get('/allentries/',requireLogin,(req,res)=>{
	Entry.find()
	.populate("postedBy","_id name")
	.populate("comments.postedBy","_id name")
	.sort("-createdAt")
	.then(entries=>{
		res.status(200).json({entries})
	}).catch(err=>{
		console.log(err);
	})
})

/**
 * @swagger
 * /entry/entry/{id}:
 *   get:
 *     description: Retorna la entreda correspondiente al ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de una entrada del foro.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: La información solicitada fue entregada correctamente.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 */
router.get('/entry/:id',requireLogin,(req,res)=>{
	Entry.findOne({_id:req.params.id})
	.populate("postedBy","_id name")
	.then(entry=>{
		res.status(200).json({entry})
		console.log({entry})

	}).catch(err=>{
		console.log(err);
	})
})

/**
 * @swagger
 * /entry/createEntry:
 *   post:
 *     description: Usado para solicitar crear una nueva entrada.
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
 *         descripcion: La entrada no se ha creado, debe llenar todos los campos.
 *         type: json
 */
router.post('/createEntry',requireLogin,(req,res)=>{
	const {title} = req.body;

	if(!title){
		return res.status(422).json({error:"por favor, llena todos los campos"})
	}

	req.user.password = undefined;
	const entry = new Entry({
		title,
		postedBy:req.user
	})

	entry.save().then(result=>{
		res.status(201).json({entry:result})
	}).catch(err=>{
		console.log(err);
	})
})


/**
 * @swagger
 * /entry/addstep:
 *   put:
 *     description: Usado para solicitar añadir un paso a la lista de instrucciones de la entrada.
 *     produces:
 *       - application/json
 *     responses:
 *       203:
 *         description: Instrucción añadida correctamente.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 *       422:
 *         descripcion: Error de procesamiento de datos.
 *         type: json
 */
 const processEntryFacts=(req, res, err, result)=>{

	if(err){
		return res.status(422).json({error:err})
	} else{
		Entry.findOne({_id:req.body.entryId})
			.populate("postedBy","_id name")
			.then(entry=>{
				res.status(203).json({entry})
				console.log({entry})
		}).catch(error=>{
			console.log(error);
		})
	}
}

router.put('/addstep',requireLogin,(req,res)=>{
	const step = {
		text:req.body.text,
		photo: req.body.img
	}

	Entry.findByIdAndUpdate(req.body.entryId,{
		$push:{steps:step}},{
			new: true
	})
	.exec((err,result)=>{
		processEntryFacts(req, res, err,result);
	})
})



/**
 * @swagger
 * /entry/addlabel:
 *   put:
 *     description: Usado para solicitar añadir una etiqueta a la lista de etiquetas de la entrada.
 *     produces:
 *       - application/json
 *     responses:
 *       203:
 *         description: Etiqueta añadida correctamente.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 *       422:
 *         descripcion: Error de procesamiento de datos.
 *         type: json
 */
router.put('/addlabel',requireLogin,(req,res)=>{
	const label = {
		text:req.body.label,
	}

	Entry.findByIdAndUpdate(req.body.entryId,{
		$push:{labels:label}},{
			new: true
	})
	.exec((err,result)=>{
		
		processEntryFacts(req, res, err,result);
		
	})
})

module.exports = router;