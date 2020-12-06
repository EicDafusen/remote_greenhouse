var express = require('express')
var bodyParser = require('body-parser')
var fonks = require('./fonksiyonlar')
const port = process.env.PORT ||  3000;


var {db}   = require('./db/connection');
var {HavaDurumu} = require('./db/HavaDurumu');
var neuralnetwork   = require('./neuralnetwork/build');

//Update sık çağrıldığı için verileri sürekli veritabanından çekmemek için son okunan değerleri local'de tutuyoruz
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

//Led'in durumunu al
app.get('/led/:status',(req,res)=>{

	var status = req.params.status ;
	

	if(status == "1"){
		ledStatus = 1;
	}else if(status == "0" ){
		ledStatus = 0;
	}

	res.status(200).send("");

});


// Sensör verilerini al
app.get('/degerler/:sicaklik/:nem',(req,res)=>{

	//Değelere time stamp ekleyerek değişkene kaydet 
	var timeStamp = fonks.getTimeStamp(new Date());
	degerler.humid = req.params.nem;
	degerler.temp = req.params.sicaklik;
	
	//Degeleri veri tabanına kaydet
	var durum = new HavaDurumu({
		sicaklik : req.params.sicaklik,
		nem:req.params.nem,
		timeStamp
	})
	durum.save(durum)
	.then(() => {
		//sicaklik ve nem'i NN'e vererek gerekli açıyı ve ledin son durumunu yolluyor
		var aci = neuralnetwork.calcAngle(durum.sicaklik,durum.nem)
            	res.status(200).send("OK/"+ledStatus+"/"+servoaci+"/"+aci+"/");
        }, (e) => {
            cevapOlustur(res, 400, e);
		res.status(400).send([
        })
	
})


//En son okunan değleri al
app.get('/update',(req,res)=>{

   res.status(200).send(degerler);
});

//Okunan son 10 veriyi al
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
			
app.listen(port,()=>{

	console.log("server is up");
	

});
