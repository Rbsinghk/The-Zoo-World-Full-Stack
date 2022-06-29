const userSchema = require('../models/user');
const otpSchema = require('../models/otp');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');

const getAllUser = async (req, res) => {
    try {
        const getUser = await userSchema.find(req.body)
        res.status(201).send(getUser);
    } catch (error) {
        res.status(401).send(error);
    }
}

const userProfileById = async (req, res) => {
    try {
        const _id = req.params.id;
        const getProfile = await userSchema.findById(_id)
        res.send(getProfile)
    } catch (error) {
        res.status(error);
    }
}

const userProfileUpdate = async (req, res) => {
    try {
        const _id = req.params.id;
        const profileUpdate = await userSchema.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true
        })
        res.send(profileUpdate);
    } catch (error) {
        res.status(500).send(error);
    }
}

const userProfileDelete = async (req, res) => {
    try {
        const _id = req.params.id;
        const profileUpdate = await userSchema.findByIdAndDelete(_id);
        res.send(profileUpdate);
    } catch (error) {
        res.status(500).send(error);
    }
}

const emailCode = async (req, res) => {
    try {
        let email = req.body.email;
        let data = await userSchema.findOne({ email });
        const response = {};
        if (data !== null) {
            let otpcode = Math.floor((Math.random() * 100000) + 1);
            let otpData = new otpSchema({
                email: req.body.email,
                code: otpcode,
                expireIn: new Date().getTime() + 300 * 1000
            })
            let otpResponse = await otpData.save();
            if (otpResponse) {
                async function main() {
                    let testAccount = await nodemailer.createTestAccount();
                    let transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASSWORD,
                        },
                    });
                    let info = await transporter.sendMail({
                        from: 'Fred Foo 👻" <foo@example.com>',
                        to: req.body.email,
                        subject: "OTP Here ✔",
                        html: (`Please Check the OTP for changing the password ${otpcode}`),
                    });
                }
                main().catch(console.error);
            }
            else {
                res.send("error");
            }
            res.status(201).send("Success");
        }
        else {
            res.send("Invalid Email");
        }
    } catch (error) {
        res.send("Invalid Email");
    }
}

const changepassword = async (req, res) => {
    try {
        let email = req.body.email;
        let code = req.body.code;
        let password = req.body.password;
        const data = await otpSchema.findOne({ email });
        if (data.code === code) {
            let user = await userSchema.findOne({ email })
            password = await bcrypt.hash(password, 5);
            user.password = req.body.password;
            let sav = await user.save();
            res.send(sav);
            if (sav) {
                let del = await otpSchema.findOneAndDelete(req.body.code);
            }
        } else {
            res.send("Invalid OTP");
        }
    } catch (error) {
        res.status(500).send("Invalid Email");
    }
}

module.exports = {
    userProfileById,
    userProfileUpdate,
    userProfileDelete,
    getAllUser,
    emailCode,
    changepassword
}
