const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
	title:{
		type:String,
		required:true
	},
	steps:[{
		text:String,
		photo:String
	}],
	labels:[{
		text:String
	}],
	postedBy:{
		type:ObjectId,
		ref:"User"
	}
},{timestamps:true})

mongoose.model("Entry",postSchema);