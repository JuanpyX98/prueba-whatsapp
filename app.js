const express = require('express');
const axios = require('axios');
const body_parser = require('body-parser');
require('dotenv').config();

const app = express();

const puerto = process.env.PORT || 3000;

const token = process.env.TOKEN

const mytoken = process.env.MYTOKEN;


app.get('/webhook', (req, res) => {
    let mode = req.query["hub.mode"];
    let challange = req.query["hub.challenge"]
    let token = req.query["hub.verify_token"]
    
    if(mode === "subscribe" && token === mytoken){
        res
            .status(200)
            .send(challange);
    }else{
        res.status(404);
    }

    
})

app.post('/webhook',(req, res) =>{
  const cuerpo = req.body;

  console.log(JSON.stringify(cuerpo, null,2));

  if(cuerpo.object){
    if(cuerpo.entry && cuerpo.entry[0].changes && cuerpo.entry[0].changes[0].value.message && cuerpo.entry[0].changes[0].value.message[0]){
      let phon_no_id = cuerpo.entry[0].changes[0].value.metadata.phone_number_id
      let from = cuerpo.entry[0].changes[0].value.messages[0].from;
      let msg_body  = cuerpo.entry[0].changes[0].value.messages[0].text.body

      axios({
        method:"POST",
        url:"https://graph.facebook.com/v17.0/"+ phon_no_id+"/messages?access_token="+token,
        data:{
          messsaging_product: "whatsapp",
          to:from,
          text:{
            body:"Hola"
          }
        },
        headers:{
          "Content-Type": "application/json"
        }
      })
      res.sendStatus(200);
    }else{
      res.sendStatus(404)
    }
  }
})


app.listen(puerto, () => {
    console.log('Servidor escuchando en el puerto 3000');
});