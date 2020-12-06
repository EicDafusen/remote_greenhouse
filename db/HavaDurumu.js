const mongoose = require('mongoose');

var HavaDurumuSema = new mongoose.Schema({

    sicaklik:{
		type:Number,
		required:true
		
	},
	nem:{
		type:Number,
		required:true
	},
    timeStamp:{
		type:String,
		required:true	
	}
})



var HavaDurumu = mongoose.model('HavaDurumu',HavaDurumuSema);

module.exports={HavaDurumu};
