const router = require('express').Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/filemodel");
const { v4 : uuid4 } = require("uuid");


let storage = multer.diskStorage({
    destination : (req,file, cb) =>cb(null, 'uploads/'),
    filename : (req,file,cb) =>{
        const uniqueName = `${Date.now()} - ${Math.random(Math.round() * 1E9)}${path.extname(file.
            originalname)}`;
        cb(null, uniqueName);
    }
})

let upload = multer({
    storage : storage,
    limit : { fileSize: 100000 * 10 },
}).single('myfile'); 

router.post('/', (req,res) =>{

    //Store file
    upload(req,res, async(err) =>{
        //validate request
    if(!req.file){
        console.log(`The error is ${err}`)
        return res.json({error : "All field are required."})
    }


        if(err){
            res.status(500).send({error : err.message})
        }

        
    //Store into Database
    const file = new File({
        filename : req.file.filename,
        uuid : uuid4(),
        path : req.file.path,
        size : req.file.size
    })

    const response = await file.save();
    return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`})
    //http://localhost:3000/files/2334adfadfdd2dcg-dafafafkdfaklj

    });


    
    //Response -> LINk
});


router.post('/send', async(req,res) =>{

    const { uuid, emailTo, emailFrom} = req.body;

    //Validate request
    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({ error : "All fields are required"});
        //Status 422 this mean a validation error
    }

    //Get data from database
    const file = await File.findOne({uuid : uuid});
    if(file.sender){
        return res.status(422).send({ error : "Email already send"});
    }

    file.sender = emailFrom;
    file.receiver = emailTo;

    const response = await file.save();

    //Send email
    const sendMail = require("../services/emailService");
    sendMail ({
        from : emailFrom,
        to : emailTo,
        subject : "ajShare file sharing",
        text : `${emailFrom} Shared a file with you`,
        html : require("../services/emailTemplate")({
               emailFrom : emailFrom,
               downloadLink : `${process.env.APP_BASE_URL}/files/${file.uuid}`,
               size : parseInt(file.size/1000) + 'KB',
               expires : '24 hours'
        })
    })
    return res.send({ success : true });

})

module.exports = router;