const path = require('path')
const mongoose = require('mongoose')
const express = require('express')
const multer = require('multer')
const hbs = require('hbs')
const sharp = require('sharp')

const app = express()
const port = process.env.PORT || 3000

const pathToDirectory = path.join(__dirname,'../../public')
const viewsPath = path.join(__dirname,'../../templates/views')
const partials = path.join(__dirname,'../../templates/partials')

app.set('views',viewsPath)
app.set('view engine','hbs')
hbs.registerPartials(partials)

app.use(express.static(pathToDirectory))
app.get('/', (req, res)=>{
    res.render('index',{
        myname:'Saurabh Srivastava'
    })
})

const upload = multer({
    limits:{
        filesize:1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg)$/)){
            return cb(new Error('please upload jpg or jpeg images'))
        }
        cb(undefined, true)
    }
})
app.post('/upload',upload.single('image'), async (req, res)=>{
    var image = await sharp(req.file.buffer)
    image.toFile(`${req.file.originalname}.png`)
    image=image.options.input.buffer;
    image=image.toString("base64")
    const name = req.file.originalname.split('.').slice(0, -1).join('.')
    res.render('index',{
       image,
       name:name,
       myname:'Saurabh Srivastava'
   })
},(error, req, res, next)=>{
    res.render('index',{error:error.message, myname:'Saurabh Srivastava'})
})

app.listen(port,()=>{
    console.log('server is running on port' + port)
})