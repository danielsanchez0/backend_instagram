const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required: true
	},
	password:{
		type:String,
		required:true
	},
	pic:{
		type:String,
		default:"https://images.vexels.com/media/users/3/147102/isolated/preview/082213cb0f9eabb7e6715f59ef7d322a-icono-de-perfil-de-instagram-by-vexels.png"
	},
	followers:[{type:ObjectId,ref:"User"}],
	following:[{type:ObjectId,ref:"User"}]
});

module.exports = mongoose.model("User",userSchema);