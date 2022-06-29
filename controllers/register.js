const multer = require('multer');
const userSchema = require('../models/user');
const valid = require("validator");
const bcrypt = require('bcrypt');

const Storage = multer.diskStorage({
    destination: 'public/userProfileImage',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: Storage
}).single('userProfileImage');

const register = async (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            try {
                const { name, number, email, password, } = req.body;
                if (valid.isEmpty(name)) {
                    res.json("Name not be empty");
                }
                else if (valid.isEmpty(number)) {
                    res.json("number no is not empty");
                }
                else if (valid.isEmpty(email)) {
                    res.json("Email not be empty");
                }
                else if (valid.isEmpty(password)) {
                    res.json("The password is not empty");
                }
                else if (!valid.isEmail(email)) {
                    res.json("This email is not in a correct format");
                }
                else if (number.length < 10) {
                    res.json("number no should be 10 digit");
                }
                else if (!valid.isStrongPassword(password)) {
                    res.json("Password Must be - minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10")
                }
                else {
                    const newuser = new userSchema(req.body);
                    newuser.save()
                        .then(() => res.json("Success"))
                        .catch((error) => res.send(error));
                }
            } catch (error) {
                res.json({ message: error.message })
            }

        }
    })
}

const login = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let number = req.body.number;
        const userMail = await userSchema.findOne({ email }) || await userSchema.findOne({ number });
        if (valid.isEmpty(email)) {
            res.json({ messsage: "Email not be empty" });
        }
        else if (valid.isEmpty(password)) {
            res.json({ messsage: "The password is not empty" });
        }
        else {
            const isMatch = await bcrypt.compare(password, userMail.password);
            const token = await userMail.generateAuthToken();
            if (isMatch) {
                res.status(201).send({ message: "Login Success", data: token })
            }
            else {
                res.json({ messsage: "Invalid Username or Password" });
            }
        }
    } catch (error) {
        res.json({ messsage: "Invalid Username or Password" });
    }
}

module.exports = {
    register,
    login
}