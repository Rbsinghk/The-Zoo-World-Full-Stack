const feedbackSchema = require('../models/feedback');
const multer = require('multer');
var XLSX = require('xlsx');
var path = require('path')
const valid = require("validator");

const feedbackCreate = async (req, res) => {
    try {
        const createFeedback = new feedbackSchema(req.body);
        const save = await createFeedback.save();
        res.status(201).json("Success");
    } catch (error) {
        res.status(401).send(error);
    }
}

const feedbackGet = async (req, res) => {
    try {
        const getFeedback = await feedbackSchema.find();
        res.status(201).send(getFeedback);
    } catch (error) {
        res.status(401).send(error);
    }
}

const feedbackDeleteById = async (req, res) => {
    try {
        const deleteFeedback = await feedbackSchema.findByIdAndDelete(req.params.id);
        res.send(deleteFeedback);
    } catch (error) {
        res.status(500).send(error);
    }
}

const feedbackDeleteAll = async (req, res) => {
    try {
        const deleteFeedback = await feedbackSchema.deleteMany();
        res.send(deleteFeedback);
    } catch (error) {
        res.status(500).send(error);
    }
}

const Storage = multer.diskStorage({
    destination: 'public/feedbackFile',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage: Storage
}).single('uploads');

const uploadFile = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.send("err")
        }
        else {
            try {
                var workbook = XLSX.readFile(req.file.path);
                var sheet_namelist = workbook.SheetNames;
                var x = 0;
                sheet_namelist.forEach(element => {
                    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_namelist[x]]);
                    for (x = 0; x < xlData.length; x++) {
                        // var b = xlData[x].name
                        const { name, email, subject, message } = xlData[x];
                        if (valid.isEmpty(name)) {
                            res.json({ messsage: "Name not be empty" });
                        }
                        else if (valid.isEmpty(email)) {
                            res.json({ messsage: "Email no is not empty" });
                        }
                        else if (valid.isEmpty(subject)) {
                            res.json({ messsage: "Subject not be empty" });
                        }
                        else if (valid.isEmpty(message)) {
                            res.json({ messsage: "Message is not empty" });
                        }
                        else if (!valid.isEmail(email)) {
                            res.json({ messsage: "This email is not in a correct format" });
                        }
                    }
                    feedbackSchema.insertMany(xlData)
                    x++;
                });
                res.send('Success');
            }
            catch (error) {
                res.send({ error, message: 'Data is Not Correct' })
            }
        }
    })
};

module.exports = {
    feedbackCreate,
    feedbackGet,
    feedbackDeleteById,
    feedbackDeleteAll,
    uploadFile
}