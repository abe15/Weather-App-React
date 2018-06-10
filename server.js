'use strict'

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();


app.use(express.static('static'));

app.use(bodyParser.json());


app.get('/:zipCode',(req,res)=>{

      const zip = parseInt(req.params.zipCode);
      db.collection('zipcodes').find({'Zipcode': zip}).toArray().then(
          (weather) => {

                /*if(weather.length == 0)
                {
                  res.sendStatus(400).json({'error':'Zipcode not in database'});
                  reject('');
                }
                else
                {
                    //console.log('in here');
                    res.sendStatus(200).json(weather[0]);
                    resolve('');
                }*/
              res.json(weather[0]);

          }


      ).catch(error => {res.sendStatus(500).json({'Error':error});});


});



let db;
MongoClient.connect('mongodb://abe:PanasoniC1@ds247170.mlab.com:47170/zip_codes').then( connection => {

    db= connection.db('zip_codes');
    app.listen(3000, function () {
      console.log('App started on port 3000');
    });

}).catch(error => {

  console.log('Error: ',error);


});
