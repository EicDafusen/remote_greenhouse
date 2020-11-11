const mongoose = require('mongoose');



mongoose.connect('mongodb://***:***@ds263876.mlab.com:63876/sera',()=>{
	console.log('connectted to mongodb');
},{ useNewUrlParser: true });

mongoose.connection.on('connected',function(){
	console.log('Mongoose adresindeki veritabanına bağlantdı\n');
});

mongoose.connection.on('error',function(err){
	console.log('Mongoose bağlantı hatası\n: ' + err );
});



module.exports={mongoose};
