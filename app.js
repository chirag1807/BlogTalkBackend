require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoute = require('./api/routes/userRoutes');
const userFollowersRoute = require('./api/routes/userFollowersRoutes');
const userFollowingRoute = require('./api/routes/userFollowingRoutes');
const mutedRoute = require('./api/routes/mutedRoutes');
const favTopicsRoute = require('./api/routes/favTopicsRoutes');
const blogPostRoute = require('./api/routes/blogPostRoutes');
const savePostRoute = require('./api/routes/savePostRoutes');
const topicNameIdRoute = require('./api/routes/topicNameIds');
const updateFollowersFollowings = require('./api/routes/updateFollowersFollowings');

mongoose.connect(process.env.mongoose_link_for_connection);

mongoose.connection.on('error', err=>{
    console.log('Connection Failed');
});

mongoose.connection.on('connected', connected=>{
    console.log('Connection Succeed');
});

app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use('/api/user', userRoute);
app.use('/api/userFollowers', userFollowersRoute);
app.use('/api/userFollowing', userFollowingRoute);
app.use('/api/muted', mutedRoute);
app.use('/api/favTopics', favTopicsRoute);
app.use('/api/blogPost', blogPostRoute);
app.use('/api/savePost', savePostRoute);
app.use('/api/topicNameId', topicNameIdRoute);
app.use('/api/updateFollowersFollowings', updateFollowersFollowings);

app.use('/', (req, res) => {
    res.status(200).json(({
        msg: "Server is listening at port no. 3000"
    }))
});

module.exports = app;