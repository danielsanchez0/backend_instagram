const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Entry = mongoose.model("Entry");

router.get('/allentries/',requireLogin,(req,res)=>{
	Entry.find()
	.populate("postedBy","_id name")
	.populate("comments.postedBy","_id name")
	.sort("-createdAt")
	.then(entries=>{
		res.json({entries})
	}).catch(err=>{
		console.log(err);
	})
})

router.get('/entry/:id',requireLogin,(req,res)=>{
	Entry.findOne({_id:req.params.id})
	.populate("postedBy","_id name")
	.then(entry=>{
		res.json({entry})
		console.log({entry})

	}).catch(err=>{
		console.log(err);
	})
})

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
		res.json({entry:result})
	}).catch(err=>{
		console.log(err);
	})
})


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
		if(err){
			return res.status(422).json({error:err})
		} else{
			Entry.findOne({_id:req.body.entryId})
				.populate("postedBy","_id name")
				.then(entry=>{
					res.json({entry})
					console.log({entry})
			}).catch(err=>{
				console.log(err);
			})
		}
	})
})

router.put('/addlabel',requireLogin,(req,res)=>{
	const label = {
		text:req.body.label,
	}

	Entry.findByIdAndUpdate(req.body.entryId,{
		$push:{labels:label}},{
			new: true
	})
	.exec((err,result)=>{
		if(err){
			return res.status(422).json({error:err})
		} else{
			Entry.findOne({_id:req.body.entryId})
				.populate("postedBy","_id name")
				.then(entry=>{
					res.json({entry})
					console.log({entry})
			}).catch(err=>{
				console.log(err);
			})
		}
	})
})


router.post('/search-entry',(req,res)=>{
	let entryPattern = new RegExp("^"+req.body.query)
	Entry.find({title:{$regex:entryPattern}})
	.then(entry=>{
		res.json({entry})
	}).catch(err=>{
		console.log(err)
	})
})

module.exports = router;