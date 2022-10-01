import express from 'express';
import mongoose from 'mongoose';
import {registerValidator} from './validations/reg_validation.js';
import {loginValidator} from "./validations/login_validation.js";
import checkAuth from "./utils/checkAuth.js";
import multer from 'multer';
import cors from 'cors';

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.nzq30wx.mongodb.net/blog?retryWrites=true&w=majority'
).then(()=>{
    console.log('DB  ok')
}).catch((err)=>console.log('DB error',err))

const app = express();

const storage = multer.diskStorage({
    destination:(_,__,cb)=>{
        cb(null,'uploads')
    },
    filename:(_,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload = multer({storage})


app.use(express.json())
app.use(cors())
app.use('/uploads',express.static('uploads'))

app.post('/auth/login',loginValidator,handleValidationErrors,UserController.login)
app.post('/auth/register', registerValidator, handleValidationErrors,UserController.register)
app.get('/auth/me',checkAuth,UserController.authMe)

app.post('/upload',checkAuth,upload.single('image'),(req,res)=>{
    res.json({
        url:`/uploads/${req.file.originalname}`,
    })
})

app.get('/posts',PostController.getAll)
app.get('/posts/:test',PostController.getOne)

app.delete('/posts/:test',checkAuth,PostController.remove)
app.post('/posts',checkAuth,handleValidationErrors,PostController.create)
app.patch('/posts/:test',checkAuth,handleValidationErrors,PostController.update)

app.listen(4444,(err)=>{
    if(err){
        return console.log(err)
    }
    console.log('server ok')
})