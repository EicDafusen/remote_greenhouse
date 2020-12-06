const brain = require("brain.js");
var fs = require('fs');


const config = {
    binaryThresh: 0.5,
    hiddenLayers: [3],     // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid',  // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
    leakyReluAlpha: 0.01   // supported for activation type 'leaky-relu'
};

const network = new brain.NeuralNetwork(config);

var obj = JSON.parse(fs.readFileSync('./neuralnetwork/myjsonfile.json', 'utf8'));
network.fromJSON(obj);



var calcAngle = (temp,humid) => {
    
    var output =  network.run([0.01*temp,0.01*humid])
    output.toString();
    return output.toString().slice(2,4);
}


module.exports = {
    calcAngle
}
