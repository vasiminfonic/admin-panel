import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import path from 'path';
import fs from 'fs'

import { MONGODB_URL, PORT } from "./config";
import errorHandlers from "./middlewares/errorHandlers";
import router from './router'

const app = express();


mongoose.connect(MONGODB_URL,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB connected...');
});

global.appRoot = path.resolve(__dirname);

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/uploads',express.static('uploads'));
app.use('/api',router);

app.use(errorHandlers);





app.use(express.static('react/build'))

const filePath = path.resolve(__dirname, 'react/build', 'index.html')


app.get('/*', function(request, response) {
  console.log('Home Page');
  fs.readFile(filePath, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    // response.send(data);
  });
});



app.listen(PORT, ()=>{
    console.log(`Server Has Been Started ${PORT} `)
})