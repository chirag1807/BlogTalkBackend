const blogPostModel = require("../models/blogPostModel");
const userModel = require("../models/userModel");
const savePostModel = require("../models/savePostModel");
const favTopicsModel = require("../models/favTopicsModel");
const userFollowersModel = require("../models/userFollowersModel");
const notificationModel = require("../models/notificationModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const jwt = require("jsonwebtoken");
const secret_key_Access_Token = process.env.secret_key_Access_Token;
const cron = require("node-cron");
const sgMail = require("@sendgrid/mail");
const api_key_for_sendgrid_mail = process.env.api_key_for_sendgrid_mail;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: 877259119788592,
  api_secret: process.env.api_secret,
});

const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FCM_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const getAllPosts = (req, res) => {
  const getUsersAllPost = async () => {
    const headers = req.headers;
    try {
      const result = await blogPostModel.find({
        author: headers.id == "" ? headers.uid : headers.id,
      });
      if (result == undefined) {
        res.status(204).json({
          msg: "No Blog Post Available for this User",
        });
      } else {
        // const modifiedResult = result.map((document) => {
        //     const modifiedDocument = JSON.parse(JSON.stringify(document));

        //     if(modifiedDocument.likes.includes(headers.uid)){
        //         modifiedDocument.likedOrNot = 1;
        //     }
        //     else{
        //         modifiedDocument.likedOrNot = 0;
        //     }

        //     return modifiedDocument;
        // })

        const modifiedResult = result.map((item) => {
          return {
            id: item._id,
            title: item.title,
            topic: item.topic,
            image: item.coverImage,
            publishedAt: item.publishedAt,
            readMinute: item.readMinute,
          };
        });

        res.status(200).json({
          result: modifiedResult,
          msg: "User's all Posts Fetched Successfully",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        msg: "Can't fetch User Details",
      });
    }
  };

  getUsersAllPost();
};

const getParticularPosts = (req, res) => {
  const getUserParticularPost = async () => {
    try {
      var result = await blogPostModel
        .find({ _id: req.headers.id })
        .populate("author");
      if (result[0] == undefined) {
        res.status(401).json({
          msg: "Invalid Token",
        });
      } else {
        const accessToken = req.headers.authorization.split(" ")[1];
        const result1 = jwt.verify(accessToken, secret_key_Access_Token);
        if (result1 != null) {
          const modifiedResult = JSON.parse(JSON.stringify(result[0]));
          if (modifiedResult.likes.includes(result1.uid)) {
            modifiedResult.likedOrNot = 1;
          } else {
            modifiedResult.likedOrNot = 0;
          }
          if (modifiedResult.author._id == result1.uid) {
            modifiedResult.createdByYou = 1;
          } else {
            modifiedResult.createdByYou = 0;
          }
          // if(modifiedResult.views.includes(result1.uid)){
          //     modifiedResult.viewedOrNot = 1;
          // }
          // else{
          //     modifiedResult.viewedOrNot = 0;
          // }
          result = await userModel
            .find({ _id: result[0].author.id })
            .populate("followers");
          let followingOrNot = result[0].followers.followersUid.some(
            (obj) => obj.followerUid === result1.uid
          );
          modifiedResult.followingOrNot = followingOrNot ? 1 : 0;

          result = await savePostModel.find({ uid: result1.uid });
          let savedOrNot = result.some((obj) => obj._id === req.headers.id);
          modifiedResult.savedOrNot = savedOrNot ? 1 : 0;

          res.status(200).json({
            result: modifiedResult,
            msg: "Post Fetched Successfully",
          });
        } else {
          return res.status(401).json({
            msg: "Token is invalid",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        msg: "Can't fetch User Details",
      });
    }
  };
  getUserParticularPost();
};

const uploadPost = (req, res) => {
  const uploadUserPost = async () => {
    const headers = req.headers;
    try {
      if (req.file) {
        var locaFilePath = req.file.path;

        var dataAndUrl = await uploadToCloudinary(locaFilePath);
      }

      const contentWithoutLineBreaks = req.body.content.replace(/\n/g, " ");

      const readTimeMinutes =
        contentWithoutLineBreaks.trim().split(/\s+/).length / 180;

      const post = new blogPostModel({
        title: req.body.title,
        content: req.body.content,
        topic: parseInt(req.body.topic),
        author: headers.uid,
        coverImage: req.file ? dataAndUrl.url : "",
        readMinute: Math.ceil(readTimeMinutes),
      });

      const result = await post.save();

      res.status(200).json({
        result: result,
        msg: "Blog Post Uploaded Successfully",
      });

      const delayInMinutes = 1;

      const scheduledTime = new Date(Date.now() + delayInMinutes * 60000);

      const cronTime = `${scheduledTime.getMinutes()} ${scheduledTime.getHours()} ${scheduledTime.getDate()} ${
        scheduledTime.getMonth() + 1
      } *`;

      const task = cron.schedule(cronTime, async () => {

        const searchValue = result.topic;
        const favoriteTopics = await favTopicsModel.find({
          favTopics: searchValue,
        });

        const favoriteTopicIds = favoriteTopics.map((topic) => topic._id);

        const users = await userModel
          .find({
            favTopics: { $in: favoriteTopicIds },
          })
          .select("emailId name");

        const blogPostTitle = result.title;
        const blogPostPublishedOn = result.publishedAt;

        const date = new Date(blogPostPublishedOn);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const authorNameImg = await userModel.find({_id: headers.uid}).select('name');

        sgMail.setApiKey(api_key_for_sendgrid_mail);

        for (const user of users) {
          const userName = user.name;
          const emailText = `Dear ${userName},\n\nA new blog post has been published on our application that matches your preferred topic(s). Check it out now.\n\nAuthor: ${authorNameImg[0].name}\nTitle: ${blogPostTitle}\nPublished On: ${formattedDate}\n\nThank you for your continued support!\n\nBest regards,\nThe BlogTalk Team`;
          const message = {
            to: user.emailId,
            from: "chiragmakwana1807@gmail.com",
            subject: "New Blog Post Published",
            text: emailText,
          };
          const abc = await sgMail.send(message);
          console.log(abc);
        }

        const users1 = await userFollowersModel.find({_id: headers.followerId});
      
      for(var user of users1[0].followersUid){
        const user1 = await userModel.find({_id: user.followerUid});
        const notificationObject = {
          "notificationId": 1,
          "name": authorNameImg[0].name,
          "userId": headers.uid,
          "blogId": result._id,
          "content": "has Posted a Blog",
          "image": authorNameImg[0].image
        }
        const notification = await notificationModel.findOneAndUpdate({_id: user1[0].notification},
          {
            $inc: {notificationCount: 1},
            $push: {notificationContent: notificationObject}
          }
        );

        const message = {
          data: {
            title: "New Notification",
            body: "Someone Posted a Blog",
          },
          token: user1[0].deviceToken
        }

        admin.messaging().send(message)
        .then((result) => {
          console.log(result + " : Notification has been sent...");
        })
        .catch((err) => {
          console.log(err);
        });
      }

        task.destroy();
      });

    } catch (error) {
      res.status(400).json({
        msg: error,
      });
    }
  };
  uploadUserPost();
};

const updatePost = (req, res) => {
  const updateUserPost = async () => {
    try {
      const headers = req.headers;
      if (req.file) {
        var locaFilePath = req.file.path;

        var dataAndUrl = await uploadToCloudinary(locaFilePath);
      }

      let blog = await blogPostModel.find({ _id: req.body.id });

      if (dataAndUrl != undefined) {
        blog[0].coverImage = dataAndUrl.url;
      }

      if (blog[0].title != req.body.title) {
        blog[0].title = req.body.title;
      }
      if (blog[0].content != req.body.content) {
        blog[0].content = req.body.content;
        const contentWithoutLineBreaks = req.body.content.replace(/\n/g, " ");
        const readTimeMinutes =
          contentWithoutLineBreaks.trim().split(/\s+/).length / 180;

        blog[0].readMinute = Math.ceil(readTimeMinutes);
      }
      if (blog[0].topic != parseInt(req.body.topic)) {
        blog[0].topic = parseInt(req.body.topic);
      }

      await blog[0].save();

      res.status(200).json({
        msg: "Blog Post Updated Successfully",
      });

    } catch (error) {
      console.log(error);
      res.status(400).json({
        msg: error,
      });
    }
  };
  updateUserPost();
};

async function uploadToCloudinary(locaFilePath) {
  var mainFolderName = "main";
  var filePathOnCloudinary = mainFolderName + "/" + locaFilePath;

  return cloudinary.uploader
    .upload(locaFilePath)
    .then((result) => {
      fs.unlinkSync(locaFilePath);

      return {
        message: "Success",
        url: result.url,
      };
    })
    .catch((error) => {
      fs.unlinkSync(locaFilePath);
      return { message: "Fail" };
    });
}

const updatePostLike = (req, res) => {
  const updateUserPostLike = async () => {
    const headers = req.headers;
    try {
      const result1 = await blogPostModel.find({ _id: req.body.id });
      let update;
      if (result1[0].likes.includes(headers.uid)) {
        update = {
          $pull: {
            likes: headers.uid,
          },
          $inc: {
            noOfLikes: -1,
          },
        };
      } else {
        update = {
          $addToSet: {
            likes: headers.uid,
          },
          $inc: {
            noOfLikes: 1,
          },
        };
      }

      const result = await blogPostModel.findOneAndUpdate(
        { _id: req.body.id },
        update,
        { upsert: true }
      );

      // const result = await blogPostModel.findOneAndUpdate({_id: req.body.id}, {
      //     $pull: {
      //         likes: headers.uid
      //     },
      //     $inc: {
      //         noOfLikes: -1
      //     }
      // });

      res.status(200).json({
        result: result,
        msg: "Like Added to Post",
      });
    } catch (error) {
      res.status(400).json({
        msg: "Can't Remove Like from Post",
      });
    }
  };
  updateUserPostLike();
};

const updatePostIncrView = (req, res) => {
  const incrementPostView = async () => {
    const headers = req.headers;
    try {
      const result = await blogPostModel.findOneAndUpdate(
        { _id: req.body.id, views: { $ne: headers.uid } },
        { $push: { views: headers.uid }, $inc: { noOfViews: 1 } },
        { new: true }
      );

      if (result) {
        res.status(200).json({
          msg: "View Added to Post",
        });
      } else {
        res.status(200).json({
          msg: "View Could not be Added",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        msg: "Can't Add View to Post",
      });
    }
  };
  incrementPostView();
};

const deletePost = (req, res) => {
  const deleteUserPost = async () => {
    // try {
    //   const result = await blogPostModel.deleteOne({ _id: req.body.id });
    //   res.status(200).json({
    //     // result: result[0],
    //     msg: "Post Deleted Successfully",
    //   });
    // } catch (error) {
    //   res.status(400).json({
    //     msg: "Can't fetch User Details",
    //   });
    // }

    const message = {
      data: {
        title: "New Notification",
        body: "Someone Posted a Blog",
      },
      token: "cVRi3A42Qj6_SiPovust2t:APA91bGi3fV9B6l46Sz48hC8IFt7y3XbwJBNjAkiKqN-YANvKVJeJPdL61SIARZvU0vd6wQjW0z1GmlQMP0wWJ0ty15nBGcluTCoo9_xe8JM0rIKqqRDfi8wSS8uC5icyqkEIM9OQe9t"
    }

    admin.messaging().send(message)
    .then((result) => {
      console.log(result + " : Notification has been sent...");
    })
    .catch((err) => {
      console.log(err);
    });
  };
  deleteUserPost();
};

module.exports = {
  getAllPosts,
  getParticularPosts,
  uploadPost,
  updatePost,
  updatePostLike,
  updatePostIncrView,
  deletePost,
};
