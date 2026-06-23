import dotenv from 'dotenv';
import path from 'path';


dotenv.config({
    path: '.env'
});

import express from 'express'
import connectdb from './utils/db.js'

const app = express()
app.get('/', (req, res) => {
    res.send('this is the job connect')

})


// connecting the db
connectdb().then(()=>{
app.listen(8000 ,()=>{
console.log(`the server is running at ${8000}`)
})})
