import express, { urlencoded } from "express";
import path from "path";
import bodyParser from "body-parser";
import { nanoid } from "nanoid";

const app=express();
// app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));



app.get("/",(req,res)=>{
    res.sendFile('index.html',{root:path.dirname("")});
})




app.post("/shorten",(req,res)=>{

    const shortUrl=nanoid(6);

    
    const data=req.body;
    const longUrl=data.url;
    
    
    res.json({
        status:"succes",
    })
})

app.listen(8080,()=>{
    console.log("server is running on port 8080");
    
})