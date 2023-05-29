const userModel = require('../models/userModel');
const forgotPasswordCodeModel = require('../models/forgotPasswordCodeModel');
const userFollowingModel = require('../models/userFollowingModel');
const userFollowersModel = require('../models/userFollowersModel');
const mutedModel = require('../models/mutedModel');
const blogPostModel = require('../models/blogPostModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const { json } = require('body-parser');
const secret_key_Access_Token = process.env.secret_key_Access_Token;
const secret_key_Refresh_Token = process.env.secret_key_Refresh_Token;
const api_key_for_sendgrid_mail = process.env.api_key_for_sendgrid_mail;
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.cloud_name, 
    api_key: 877259119788592, 
    api_secret: process.env.api_secret
  });

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
                let result = await userModel.find({_id: headers.id == "" ? headers.uid : headers.id})
                // .populate("followers").populate("favTopics");
                if(result[0] == undefined){
                    res.status(401).json({
                        msg: "Invalid Token"
                    })
                }
                else {
                    const modifiedResult = {
                        _id: result[0]._id,
                        name: result[0].name,
                        bio: result[0].bio,
                        image: result[0].image,
                        sendEmail: result[0].sendEmail,
                        sendNotification: result[0].sendNotification,
                    }
                    
                    result = await userFollowingModel.find({_id: headers.followingId}, 'followingCount');
                    modifiedResult.followingsCount = result[0].followingCount;

                    result = await userFollowersModel.find({_id: headers.followerId}, 'followerCount');
                    modifiedResult.followersCount = result[0].followerCount;

                    result = await blogPostModel.find({author: headers.uid}).countDocuments();
                    modifiedResult.postsCount = result;
                    
                    res.status(200).json({
                    result: modifiedResult,
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

const postUser = (req, res) => {
    const createUser = async () => {
        try {
            if(req.file){

            var locaFilePath = req.file.path;

            var dataAndUrl = await uploadToCloudinary(locaFilePath);
            }

            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if(err){
                    return res.status(500).json({
                        msg: err
                    })
                }
                else{
                    const user = new userModel({
                        name: req.body.name,
                        bio: req.body.bio,
                        emailId: req.body.emailId,
                        password: hash,
                        image: req.file ? dataAndUrl.url : "",
                    })
                    const result = await user.save();

                    const userFollowers = new userFollowersModel({
                        _id: result.followers,
                    })
                    await userFollowers.save();
        
                    const userFollowings = new userFollowingModel({
                        _id: result.followings,
                    })
                    await userFollowings.save();
                    
                    const mutedTopicWriters = new mutedModel({
                        _id: result.muted,
                    })
                    await mutedTopicWriters.save();

                    // const addUid = await userModel.findOneAndUpdate({_id: result._id},
                    //     {
                    //         $set: {'uid': result._id}
                    //     }    
                    // )

                    const accessToken = generateAccessToken(result._id,
                        result.favTopics, result.followers, result.followings, result.muted);
                    const refreshToken = generateRefreshToken(result._id,
                        result.favTopics, result.followers, result.followings, result.muted);

                    console.log(result.followers.id);
                    
                    res.status(200).json({
                        result: result,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        msg: "User Created Successfully"
                    })
                }
            })

        }
        catch (error) {
            res.status(400).json({
                msg: error
            })
        }
    }

    createUser();
}

async function uploadToCloudinary(locaFilePath) {
  
    var mainFolderName = "main";
    var filePathOnCloudinary = mainFolderName + "/" + locaFilePath;

    return cloudinary.uploader
        .upload(locaFilePath)
        .then((result) => {

            // Remove file from local uploads folder
            fs.unlinkSync(locaFilePath);
  
            return {
                message: "Success",
                url: result.url,
            };
        })
        .catch((error) => {
  
            console.log(error);
            // Remove file from local uploads folder
            fs.unlinkSync(locaFilePath);
            return { message: "Fail" };
        });
}

const updateNameBio = (req, res) => {
    const updateUserNameBio = async () => {
        try{
            if(req.file){

                var locaFilePath = req.file.path;
    
                var dataAndUrl = await uploadToCloudinary(locaFilePath);
            }
            const {name, bio} = req.body;
            const user = await userModel.findOneAndUpdate({_id: req.headers.uid}, {
                $set:{
                    name: name,
                    bio: bio,
                    image: req.file ? dataAndUrl.url : "",
                }
            })
            if(user){
                res.status(200).json({
                    msg: "User Details Updated"
                })
            }
            else{
                res.status(400).json({
                    msg: "Can't Update User Details"
                })
            }
        }
        catch (error) {
            res.status(400).json({
                msg: "Can't Update User Details"
            })
        }
    }
    updateUserNameBio();
}

const updateEmailPass = (req, res) => {
    const updateUserEmailPass = async () => {
        try{
            const {email, oldPass, newPass} = req.body;
            const user = await userModel.find({emailId: email});
            if(user[0] == undefined){
                return res.status(403).json({
                    msg:"Email doesn't exist."
                })
            }
            else if(oldPass == newPass){
                user[0].emailId = email;
                await user[0].save();
                res.status(200).json({
                    msg:"Email and Password Updated Successfully"
                })
            }
            else{
                bcrypt.compare(oldPass, user[0].password, (err, result) => {
                    if(err){
                        return res.status(403).json({
                            msg:"Password doesn't match."
                        })
                    }
                    else{
                        bcrypt.hash(newPass, 10, async (err, hash) => {
                            if(err){
                                res.status(500).json({
                                    msg: "Password Can't be Encrypted"
                                })
                            }
                            user[0].emailId = email;
                            user[0].password = hash;
                            await user[0].save();
                            res.status(200).json({
                                msg:"Email and Password Updated Successfully"
                            })
                        });
                    }
                })
            }
        }
        catch (error) {
            res.status(400).json({
                msg: "Can't Update User Email Password"
            })
        }
    }
    updateUserEmailPass();
}

const updateSendEMailNotification = (req, res) => {
    const updateSendEmailNotif = async () => {
        try{
            const result = await userModel.find({_id: req.headers.uid});

            if(req.body.indicator == 0){
                if(result[0].sendEmail != req.body.value){
                    result[0].sendEmail = req.body.value;
                    await result[0].save();
                }
            }
            else{
                if(result[0].sendNotification != req.body.value){
                    result[0].sendNotification = req.body.value;
                    await result[0].save();
                }
            }

            res.status(200).json({
                msg: "Update Send Email/Notification Done Successfully"
            })
        }
        catch (error) {
            res.status(400).json({
                msg: "Can't Update Send Email/Notification"
            })
        }
    }
    updateSendEmailNotif();
}

const loginUser = (req, res) => {
    const loginParticularUser = async () => {
        const {email, password} = req.body;
        const user = await userModel.find({emailId: email});
        bcrypt.compare(password, user[0].password, (err, result) => {
            if(!result){
                return res.status(403).json({
                    msg:"Password doesn't match."
                })
            }
            else{
                const accessToken = generateAccessToken(user[0]._id, user[0].favTopics,
                    user[0].followers, user[0].followings, user[0].muted);
                const refreshToken = generateRefreshToken(user[0]._id, user[0].favTopics,
                    user[0].followers, user[0].followings, user[0].muted);
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

module.exports = {getUser, postUser, generateAccessToken, generateRefreshToken, resetToken, loginUser,
    updateNameBio, updateEmailPass, updateSendEMailNotification, forgotPasswordSendEmail, forgotPasswordVerifyCode};


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