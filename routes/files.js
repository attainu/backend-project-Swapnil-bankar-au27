const router = require('express').Router();
const multer = require('multer');

const path = require('path');

const File = require('../models/file')
    // import { v4 as uuidv4 } from 'uuid';
const { v4: uuidv4 } = require('uuid');






let storage = multer.diskStorage({
    destination: (req, file, callback) => callback(nul, 'uploads'),

    filename: (req, file, callback) => {

        //create a unique file name : 
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

        // 2435353-num(1-9 nine digit number )
        callback(null, uniqueName);



    }
})
let upload = multer({
    storage, // keys and value name are same that y we can write simply keys
    limit: { filSize: 100000 * 100 },
}).single('/myfile  ');

router.get('/', (req, res) => {
    res.send("helo")
})


router.post('/', (req, res) => {

    upload(req, res, async(err) => {
        // store the file in 

        // validate request 
        if (!req.file) {
            return res.json({ error: "somthing is missing " })
        }
        if (err) {
            return res.status(500).send({ error: err.message });
        }

        // store into DATABASE
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save();
        res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
        //http://localhost:3000/files/iddihdhd
    });


});

router.post('/send', async(req, res) => {
    const { uuid, emailTo, emailFrom, expiresIn } = req.body;
    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All fields are required except expiry.' });
    }
    // Get data from db 
    try {
        const file = await File.findOne({ uuid: uuid });
        if (file.sender) {
            return res.status(422).send({ error: 'Email already sent once.' });
        }
        file.sender = emailFrom;
        file.receiver = emailTo;
        const response = await file.save();
        // send mail
        const sendMail = require('../services/mailService');
        sendMail({
            from: emailFrom,
            to: emailTo,
            subject: ' file sharing',
            text: `${emailFrom} shared  file with you.`,
            html: require('../services/emailTemplate')({
                emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
                size: parseInt(file.size / 1000) + ' KB',
                expires: '24 hours'
            })
        }).then(() => {
            return res.json({ success: true });
        }).catch(err => {
            return res.status(500).json({ error: 'Error in email sending.' });
        });
    } catch (err) {
        return res.status(500).send({ error: 'Something went wrong.' });
    }

});



module.exports = router