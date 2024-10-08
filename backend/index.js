const express = require('express')
const app = express();
const port = process.env.PORT || 4000;
//Mongo db Connection
const mongoDB = require('./db')
mongoDB()

app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "https://foodcrave-1-frontend.onrender.com")
    res.header(
        'Access-Control-Allow-Headers',
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    next();
})
app.get('/', (req, res)=>{
    res.send('Hello world')
})
app.use(express.json())
app.use('/api', require('./Routes/CreateUser'))
app.use('/api', require('./Routes/DisplayData'))
app.use('/api', require('./Routes/OrderData'))
app.use('/api', require('./Routes/razorpay'))


app.listen(port, ()=>{
    console.log(`server running at http://localhost:${port}`)
})
