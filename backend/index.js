import express from 'express'

const app = express()
app.get('/' , (req , res)=>{
    res.send('this is the job connect')

})

app.listen(8000 ,()=>{
console.log(`the server is running at ${3000}`)
})