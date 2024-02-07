const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const port = 3080
const cors = require('cors')
const async = require('async')
const useRoute  = require('./routes/route')
const multer = require('multer')
app.use(cors())
app.use(parallel([
    express.static(path.join(__dirname, '/')),
    // compression(),
    multer({dest: __dirname + '/uploads/'}).any(),
    bodyParser.json({ limit: '50mb' }),
        
]));
app.use(useRoute)
app.use(express.static(path.join(__dirname,'/')));

app.get('/',(req,res)=>{
    console.log("server running")
    res.send('darshan gondaliya')
})

app.listen(port,()=>{
    console.log(`server runnig in ${port}`)
})

function parallel(middlewares) {
    return function (req, res, next) {
        async.each(middlewares, function (mw, cb) {
            mw(req, res, cb);
        }, next);
    };
}

