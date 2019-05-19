const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');

const application = express();
const upsideDownDictionary = require('./dictionary');

const flipWord = (workToFlip) => {
  let characters = workToFlip.split("");
  return characters.map(character => upsideDownDictionary[character] || upsideDownDictionary[character.toLocaleLowerCase()] || character)
    .reduce((message, character)=> character + message, '');
};

application.use(bodyParser.json({strict: false}));
application.use(bodyParser.urlencoded({extended: true}));

const getResponse = requestBody => {
  return '(╯°□°)╯︵' + flipWord(requestBody.text.trim().substring(5));
};

const isGoodRequest = request => {
  const requestBody = request.body;
  return requestBody && requestBody.text &&
    requestBody.text.startsWith("flip")
};

application.post('/', (request, response)=>{
  if(isGoodRequest(request)){
    response.json({
      "text": getResponse(request.body),
      "response_type": "in_channel",
    });
  } else {
    response.json({
      "text": `Usage: <Command> <Argument>`,
      "response_type": "in_channel",
    });
  }
});




application.listen(8000, ()=>console.log("listening on 8000"));

module.exports.handler = serverless(application);
