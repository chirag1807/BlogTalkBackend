const userModel = require('../models/userModel');
const forgotPasswordCodeModel = require('../models/forgotPasswordCodeModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const { json } = require('body-parser');
const secret_key_Access_Token = process.env.secret_key_Access_Token;
const secret_key_Refresh_Token = process.env.secret_key_Refresh_Token;
const api_key_for_sendgrid_mail = process.env.api_key_for_sendgrid_mail;

const generateAccessToken = (uid, favTopicsId, followerId, followingId, mutedId) => {
    const accessToken = jwt.sign({
        uid: uid,
        favTopicsId: favTopicsId,
        followerId: followerId,
        followingId: followingId,
        mutedId: mutedId
    },
    secret_key_Access_Token,
    {
        expiresIn: "24h"
    }
    )
    console.log(accessToken);
    return accessToken;
}

const generateRefreshToken = (uid, favTopicsId, followerId, followingId, mutedId) => {
    const refreshToken = jwt.sign({
        uid: uid,
        favTopicsId: favTopicsId,
        followerId: followerId,
        followingId: followingId,
        mutedId: mutedId
    },
    secret_key_Refresh_Token,
    {
        expiresIn: "1y"
    }
    )
    console.log(refreshToken);
    return refreshToken;
}

const resetToken = (req, res) => {
    const resetAccessRefreshToken = async () => {
        let refreshToken = req.body.refreshToken;
        const verify = jwt.verify(refreshToken,secret_key_Refresh_Token, (err, payload) => {
            if(err){
                return res.status(401).json({
                    msg: "please do login again",
                    jwtMsg: err.message
                })
            }
            else{
                const accessToken = generateAccessToken(payload.uid, payload.favTopicsId,
                    payload.followerId, payload.followingId, payload.mutedId);
                refreshToken = generateRefreshToken(payload.uid, payload.favTopicsId,
                    payload.followerId, payload.followingId, payload.mutedId);

                res.status(200).json({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    msg: "tokens generated successfully"
                })
            }
        });
    }

    resetAccessRefreshToken();
}

const getUser = (req, res) => {
    const getParticularUser = async () => {
            const headers = req.headers;
            try {
                const result = await userModel.find({_id: headers.uid})
                // .populate("followers").populate("favTopics");
                if(result[0] == undefined){
                    res.status(401).json({
                        msg: "Invalid Token"
                    })
                }
                else {
                    res.status(200).json({
                    result: result[0],
                    msg: "User Details Fetched Successfully"
                })
            }
            } catch (error) {
                res.status(400).json({
                    msg: "Can't fetch User Details"
                })
            }
    }

    getParticularUser();
}

const loginUser = (req, res) => {
    const loginParticularUser = async () => {
        const {email, password} = req.body;
        const user = await userModel.find({emailId: email});
        bcrypt.compare(password, user[0].password, (err, result) => {
            if(!result){
                return res.status(401).json({
                    msg:"Password doesn't match."
                })
            }
            else{
                const accessToken = generateAccessToken(user[0].uid);
                const refreshToken = generateRefreshToken(user[0].uid);
                return res.status(200).json({
                    result: user[0],
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    msg:"Logged In Successfully"
                })
            }
        })
    }

    loginParticularUser();
}

const forgotPasswordSendEmail = (req, res) => {
    const forgotUserPasswordSendEmail = async () => {

        const {email} = req.body;
        const isEmailExist = await userModel.find({emailId: email});
        if(isEmailExist[0] == undefined){
            res.status(510).json({
                msg: "Email not exist"
            })
        }
        else{
            const code = Math.floor(1000 + Math.random() * 9000);
            const forgotPassCode = new forgotPasswordCodeModel({
                code: code,
                expiresIn: new Date().getTime() + 300 * 1000
            })

            const result = await forgotPassCode.save();
            const id = result._id;
            console.log(id);

            res.status(200).json({
                msg: "Verification code has been send to your emailId",
                result: result
            })
            //send this id to user, after that send it to vrify code screen,
            //after that on press of verification, send it back to forgotpasscode,

            //and then using it, check stored code and user entered code.
            //if its same then reset password else give warning
        }



        // sgMail.setApiKey(api_key_for_sendgrid_mail);
        // const message = {
        //     to: 'jignamakwana1188@gmail.com',
        //     from: 'chiragmakwana1807@gmail.com',
        //     subject: 'Reset Your Password',
        //     text: 'Your Verification Code: 8021',
        //     html: '<h1>Your Verification Code: 8021</h1>'
        // }

        // sgMail.send(message).
        // then(result => {
        //     console.log("Email has been sent..."),
        //     res.status(200).json({
        //         msg: "Email sent successfully..."
        //     })
        // }).
        // catch(err => {
        //     console.log(err),
        //     res.status(401).json({
        //         msg: "Couldn't sent email...please try agian later"
        //     })
        // });

    }

    forgotUserPasswordSendEmail();
}

const forgotPasswordVerifyCode = async (req, res) => {
    const forgotUserPasswordVerifyCode = async () => {
        const {_id, code} = req.body;

        if(_id){
            const codeData = await forgotPasswordCodeModel.find({_id: _id});
            if(codeData[0] == undefined){
                console.log("abc");
                res.status(401).json({
                    msg: "Can't proceed further, please try again later"
                })
            }
            else{
                if(new Date().getTime() > codeData[0].expiresIn){
                    console.log("def");
                    res.status(401).json({
                        msg: "code expired, please try again"
                    })
                    //can't proceed further
                }
                else{
                    if(codeData[0].code == code){
                        res.status(200).json({
                            msg: "Verification done successfully, please reset password"
                        })
                    }
                    else{
                        res.status(401).json({
                            msg: "Please enter valid code..."
                        })
                    }
                    console.log("no");
                }
            }
        }
        else{
            res.status(401).json({
                msg: "Please provide necessary details first"
            })
            console.log("there is no id");
        }
        
        
    }
    forgotUserPasswordVerifyCode();
}

module.exports = {getUser, generateAccessToken, generateRefreshToken, resetToken, loginUser, forgotPasswordSendEmail, forgotPasswordVerifyCode};


// const verifyToken = (accessToken) => {
//     const uid = jwt.verify(accessToken, secret_key_Access_Token, (err, payload) => {
//         if(err){
//             return null;
//         }
//         else{
//             return payload.uid;
//         }
//     })

//     return uid;
// }