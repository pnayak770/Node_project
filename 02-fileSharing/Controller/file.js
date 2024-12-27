import path from 'path';
import multer from 'multer';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import Filemodel from '../Model/file';
import mongoose from 'mongoose';
import "config/dotenv"




// dotenv.config();

const transporter = nodemailer.createTransport({
    host : "127.0.0.1",
    port : "1025",
    secure : false,
    // auth : {
    //     username : "",
    //     password : ""
    // }
})

const uploadForPath = "uploads";

const storage = multer.diskStorage({
    destination: (req, file, cb)=> cb(null, uploadForPath),
    filename:(req,file,cb)=>{
        const filename = uuidv4() + path.extname(file.originalname)
        cb(null, filename)
    }
})

const upload = multer({
    storage: storage
}).single("attachementfile")

const saveFile = async (req, res)=>{
    // try{
        upload(req,res,async (error)=>{
            if (error) {
                console.log(error);
                return res.status(400).json({
                  success: false,
                  message: "File size too large",
                });
              }
       
        // const fileData = {
        //     originalname : 
        // }
        

        // console.log(req.file);
        const fileData = {
            originalname: req.file.originalname,
            newname : req.file.filename,
            size : req.file.size
        }
        // console.log(fileData,"file Data")
        const newlyInsteredFile = await Filemodel.create(fileData)
        res.json({
            status : true,
            message : "File Successfully uploaded.",
            fileId : newlyInsteredFile._id
        })
    })

    // }catch(error){
    //     res.json({
    //         status : false,
    //         message : "Something went wrong. Please try again!"
    //     })
    // }
}

const downloadFile = async (req, res)=>{
    try{

        const list = await Filemodel.findById(req.params.fileId)
        console.log(list)
        // const sharableLink = `/files/download/${req.params.fileId}`
        if (!list) {
            // File is not available for this ID
            return res.status(400).json({
              success: false,
              message: "Inavlid File ID",
            });
          }
          const path = `uploads/${list.newname}`
          res.download(path, list.originalname)

    }catch(error){
        res.json({
            status : false,
            message : "Something went wrong. Please try again!"
        })
    }
}

const deleteFile = async (req, res)=>{
    try{
        const deleteFile = await Filemodel.findByIdAndDelete(req.params.fileId)
        console.log(deleteFile)
        res.json({
            status : true,
            message : "File Successfully deleted."
        })

    }catch(error){
        res.json({
            status : false,
            message : "Something went wrong. Please try again!"
        })
    }
}

const sendFileLink = (req, res)=>{
    try{
        const fileId = req.body.fileId;
        const shareableLink = `https://filesharingapp-backend-00ux.onrender.com//files/uploads/${fileId}`
        const emailData = {
            to : req.body.email,
            from : "donotreply@filesharing.com",
            subject : "Your friend",
            html : `<h1>Hi. How are You? </h1><a href=${shareableLink}>Link</a>`
        }
        transporter.sendMail(emailData, (error, info)=>{
            if (error){
        
                console.log(error);
                
                return res.json({
                    success: false,
                    message: "Unable to send email",
                    error: error,
                });
                }
              
              console.log(info);
        })
        res.json({
            status : true,
            message : "File Send Successfully."
        })

    }catch(error){
        res.json({
            status : false,
            message : "Something went wrong. Please try again!"
        })
    }
}

const fileController = {
    saveFile,
    downloadFile,
    deleteFile,
    sendFileLink
}


module.exports = fileController;
