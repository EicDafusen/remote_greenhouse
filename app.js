var express = require('express')
var bodyParser = require('body-parser')
var fonks = require('./fonksiyonlar')


var {db}   = require('./db/connection');
var {HavaDurumu} = require('./db/HavaDurumu');
var neuralnetwork   = require('./neuralnetwork/build');


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

	res.status(200).send("");

});


// Sensör verilerini alan endpoint
app.get('/degerler/:sicaklik/:nem',(req,res)=>{

	//Değelere time stamp ekleyerek local 
	var timeStamp = fonks.getTimeStamp(new Date());
	degerler.humid = req.params.nem;
	degerler.temp = req.params.sicaklik;
	
	
	var aci = neuralnetwork.calcAngle(req.params.sicaklik,req.params.nem)
	res.status(200).send("OK/"+ledStatus+"/"+servoaci+"/"+aci+"/");

})

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





const port = process.env.PORT ||  3000;
app.listen(port,()=>{

	console.log("server is up");
	

});
