var express = require('express')
var bodyParser = require('body-parser')

var fonks = require('./fonksiyonlar')


var {db}   = require('./db/connection');
var {HavaDurumu} = require('./db/HavaDurumu');
var neuralnetwork   = require('./neuralnetwork/build');




// 200 HER ZAMAN GERI DONULMELI

var degerler = {
	temp: 0,
	humid: 0
}

var ledStatus = 0;
var servoaci=0 ;


var app = express();
app.use(bodyParser.json());

var response = function(res,data){
	if(data ){
		res.send(data);
	}else{
		res.status(404).send({});
	}
}

/** Servo acisini ayarlama */
app.get('/servo/:yeniaci',(req,res)=>{

	
	var gelen = req.params.yeniaci;
	 servoaci = gelen;

    console.log(gelen+"-degisti-"+servoaci);
    res.status(200).send(servoaci.toString());
	
})

/** Servo acisini alma */
app.get('/servo',(req,res)=>{

	

    console.log("--istendi--"+servoaci);
    res.status(200).send(servoaci.toString());
	
})

app.get('/led/:status',(req,res)=>{

	var status = req.params.status ;
	

	if(status == "1"){
		ledStatus = 1;
	}else if(status == "0" ){
		ledStatus = 0;
	}

	res.status(200).send("2321");

});



/** Sıcaklığı Alıp Time Stample Kaydetme */
app.get('/degerler/:sicaklik/:nem',(req,res)=>{

	
	var timeStamp = fonks.getTimeStamp(new Date());
	degerler.humid = req.params.nem;
	degerler.temp = req.params.sicaklik;

	var aci = neuralnetwork.calcAngle(req.params.sicaklik,req.params.nem)
	res.status(200).send("OK/"+ledStatus+"/"+servoaci+"/"+aci+"/");



   /*
	var sicaklik = new Sicaklik({
		sicaklik: gelen,
		timeStamp: timeStamp
	})

   sicaklik.save(sicaklik).then((sicaklik)=>{
	   if(sicaklik){
		res.status(200).send(sicaklik);
   }
	   

   },(e)=>{
	     res.status(404).send(e);
   });
   */

})


/** */

app.get('/update',(req,res)=>{

   res.status(200).send(degerler);
   
	

});

app.get('/gunlukdurum',(req,res)=>{

	HavaDurumu.find().sort({_id:-1}).limit(10).then((durumlar)=>{

		if(durumlar){
			res.status(200).send(durumlar)
		}else{
			res.status(400).send();
		}
		

	},(e)=>{
		res.status(500)
	});
	


})




 /*var lul = ()=>{
	var havaDurumu = new HavaDurumu({

		sicaklik: 25 + Math.floor(Math.random() * 10) ,
		nem: 60 + Math.floor(Math.random() * 20),
		timeStamp :fonks.getTimeStamp(new Date())
	
	})
	
	havaDurumu.save(havaDurumu).then((hava)=>{
			console.log(hava)
	})
} */




const port = process.env.PORT ||  3000;
app.listen(port,()=>{

	console.log("server is up");
	

});