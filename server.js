const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

// Images 
const images = {
    A: "https://as1.ftcdn.net/v2/jpg/04/95/79/32/1000_F_495793293_3kHObjYdHsn038GyVmbalmygoLGGFEJa.jpg",
    B: "https://as2.ftcdn.net/v2/jpg/05/62/34/07/1000_F_562340770_UE3MTKX3hffXS9TO0UPNL2x3pbkzPng5.jpg",
    C: "https://t3.ftcdn.net/jpg/05/02/39/72/240_F_502397242_hXW3hWiV8CuI5PBk5kKg9C0TD4tQesm6.jpg",
    D: "https://t4.ftcdn.net/jpg/05/90/76/43/240_F_590764314_NyAPAbf3qDbHZWHqcJ9D7rDaqA0xxnzv.jpg",
    E: "https://t3.ftcdn.net/jpg/03/59/95/78/240_F_359957832_NqWrwB4lMkILwsX3QbD12skdaAo8FKqS.jpg",
    F: "https://t3.ftcdn.net/jpg/04/94/99/08/240_F_494990881_dLUmM94wmVUoYZwoGj81VsgWdky5jbb9.jpg",
    G: "https://t3.ftcdn.net/jpg/04/00/17/52/240_F_400175291_RRjktu6pLETnEwae3zamUnkDEWrswtsE.jpg",
    H: "https://t4.ftcdn.net/jpg/04/00/17/53/240_F_400175321_6gtAv6k0pYnXBWoQcDP5xhrO1cHlfz4c.jpg",
    I: "https://t4.ftcdn.net/jpg/03/60/00/71/240_F_360007134_jcq9M4Esqggp7vpRyKtkQZhH0k6N4Isd.jpg",
    J: "https://t3.ftcdn.net/jpg/03/59/95/80/240_F_359958090_SNvox9z00AqwHPZzJ5dFgbQEM609endw.jpg",
    K: "https://t4.ftcdn.net/jpg/04/00/17/53/240_F_400175390_nZuS3sUGhteYrmEQumOcZVHPTxUKID9w.jpg",
    L: "https://t4.ftcdn.net/jpg/07/30/27/61/240_F_730276145_6baNMsTDFdDH8hfIrkbkKYQyFaZ4X2F3.jpg",
    M: "https://t3.ftcdn.net/jpg/05/62/34/10/240_F_562341029_oAzXXD1PuIpjxiEVQyTCYkUklC48kZnL.jpg",
    N: "https://t3.ftcdn.net/jpg/07/47/47/72/240_F_747477251_MCocwaWVq97I4KD2HhlO0mwhAh2TDpvZ.jpg",
    O: "https://t3.ftcdn.net/jpg/03/59/95/84/240_F_359958411_vpHWE2rAA92S9Lun3WaWD9znHM9w5Ncq.jpg",
    P: "https://t3.ftcdn.net/jpg/04/01/40/04/240_F_401400439_CiL3rgcyCkEsymCcbTI0vzVw02AaF2RI.jpg",
    Q: "https://t3.ftcdn.net/jpg/04/01/40/04/240_F_401400468_agdU06J9qBISQKL0fgVBmupOc9KynjkD.jpg",
    R: "https://t3.ftcdn.net/jpg/05/03/58/24/240_F_503582489_dcz4xfbIEtYcgXiNA7fJ20nUGYOHOp0u.jpg",
    S: "https://t3.ftcdn.net/jpg/03/59/95/86/240_F_359958622_sK60OuTcqNRpN8DZqNOcMqDsE5EQql9Y.jpg",
    T: "https://t4.ftcdn.net/jpg/04/01/40/05/240_F_401400556_KBtiHHPBgsgKHVZcIe6sDH1hIAcSiYHs.jpg",
    U: "https://t4.ftcdn.net/jpg/03/59/95/87/240_F_359958759_KcWLK1OVqpZKF0sxd0NwEFrngMCYIpqT.jpg",
    V: "https://t3.ftcdn.net/jpg/04/01/40/06/240_F_401400627_oXrEYvUgyONbxzWQQHJxmX5pKs0s3zci.jpg",
    W: "https://t3.ftcdn.net/jpg/05/04/62/00/240_F_504620091_MKf7oaPGAXFuR7EyHkFP1c8WK31lPKMW.jpg",
    X: "https://t4.ftcdn.net/jpg/05/03/58/25/240_F_503582510_BTD6R1zugvCXZVUoyGrkKRGz8rWCdhZG.jpg",
    Y: "https://t4.ftcdn.net/jpg/05/03/58/25/240_F_503582518_MpyCuXlKjqmiVoOTO5FlTFKzUDVykliR.jpg",
    Z: "https://t4.ftcdn.net/jpg/05/78/07/41/240_F_578074136_T8hbMmOwfsGaMjbxFcsmwWq1sDPgmmNw.jpg"
};

const defaultImage = 'https://img.freepik.com/free-photo/3d-rendering-kid-playing-digital-game_23-2150898496.jpg?size=626&ext=jpg&ga=GA1.1.1249351520.1712655788&semt=ais';


const User = require('./Models/Users');
const Post = require('./Models/Post');
const PostLikes = require('./Models/PostLikes');
const PostTweets = require('./Models/PostTweets');
const Notification = require('./Models/Notification');
const Follow = require('./Models/FollowingFollower');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://saikiran:saikiran@cluster0.umicdmm.mongodb.net/Anime-Web?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Project connected to MongoDB.....")
    }).catch((error) => {
        console.log("Error while connecting to MongoDB.....", error)
    });

app.listen(port, () => {
    console.log("Project Server is running at your port ", port, " .....");
});

app.get("/", (req, res) => {
    res.status(200).send({"success": true, "msg": "Node server running"});
});

// End point for SignUp .........

app.post('/register', async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        // Check if email or username already exists
        const existingEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });

        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Retrieve all passwords from the database
        const users = await User.find({}, 'password');

        // Check if the hashed password matches any existing password
        for (let user of users) {
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (isPasswordMatch) {
                return res.status(400).json({ message: "Password already exists" });
            }
        }

        // Generate profile picture based on the first letter of the username
        const firstLetter = username.charAt(0).toUpperCase();
        const profilePic = images[firstLetter] || defaultImage;

        // Create a new user
        const newUser = new User({ name, email, username, password: hashedPassword, profilePic });

        // Save the user
        await newUser.save();
        console.log('Registration successful');
        return res.status(200).json({ message: 'Registration Successful' });
    } catch (error) {
        console.log('Error in server.js at POST /register: ', error);
        return res.status(500).json({ message: 'Registration Failed' });
    }
});


// End point for Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ $or: [{ username: username }, { email: username }] });
        
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            return res.status(200).json({ message: 'Login successful', username: user.username });
        }

        return res.status(400).json({ message: 'Invalid username or email' });
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
        console.log("Error login: ", error);
    }
});

// Endpoint to edit user details
app.post('/editUserDetails',async(req, res) => {
    try {

        const {name, email, username, password, profilePic} = req.body

        const user = await User.findOne({username})
        if(!user) {
            return res.status(400).json({message: "user not exist's"})
        }

        if(password) {
            const hashedPassword = await bcrypt.hash(password, 10); 
            user.password = hashedPassword
        }

        if(email) {
            user.email = email;
        }

        if(name) {
            user.name = name;
        }

        if(profilePic) {
            user.profilePic = profilePic;
            await Post.updateMany({ username }, { profilepic:profilePic });
        }

        const notMessage = "Your have successfully updated your profile.";
        const newNotification = new Notification({username, message: notMessage});
        await newNotification.save();

        await user.save()
        console.log('Editing user successful');
        return res.status(200).json({message : 'Editing user Successful'})

    } catch (error) {
        console.log('error in server.js at post editing user ... ', error)
        return res.status(500).json({message: 'editing user Failed'});
    }
});

// Endpoint to delete a user from data base.
app.delete('/deleteUserFromDB', async(req, res) => {
    try {
        const {username} = req.body

        const user = await User.findOne({username})
        if(!user) {
            return res.status(400).json({message: "user not exist's"})
        }

        // deleting user details from follow......
        await Follow.deleteMany({username});
        await Follow.deleteMany({following: username});

        // deleting user details from notifications...
        await Notification.deleteMany({username});

        // deleting user details from PostLikes and tweets...
        await PostLikes.deleteMany({username});
        await PostTweets.deleteMany({username});

        // deleting the tweets and likes for the posts of current user.
        const allUserPosts = await Post.find({ username });

        for (const post of allUserPosts) {
            await PostLikes.deleteMany({ postId: post._id });
            await PostTweets.deleteMany({ postId: post._id });
        }

        // Deleting user's posts
        await Post.deleteMany({ username });

        // Finally, deleting the user
        await User.deleteOne({ username });

        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        console.log('error in server.js at deleting user from db ... ', error)
        return res.status(500).json({message: 'deleting user from db Failed'});
    }
});

//End point for post 
app.post('/post', async(req, res) => {
    try {
        const { username, postContent, postImage } = req.body;
        const user = await User.findOne({username})
        if(!user) {
            return res.status(400).json({message: "User not exists"});
        }

        const newPost = new Post({ username, postContent, profilepic: user.profilePic });
        if(postImage) newPost.postImage = postImage;
        await newPost.save();

        user.posts = user.posts+1;
        await user.save();

        const notMessage = "Your have posted a new Post";
        const newNotification = new Notification({username, message: notMessage});
        await newNotification.save();

        console.log('Posting successful');
        return res.status(200).json({message : 'Post saved successful'});

    } catch (error) {
        res.status(500).json({ message: 'posting failed' });
        console.log("Error while posting --> : ", error);
    }
});

//End point for get all posts

app.post('/AllpostsExceptCurrentUser', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        const allPosts = await Post.find({ username: { $ne: username } });
        return res.status(200).json({ allPosts});
    } catch (error) {
        console.error("Error while fetching posts:", error);
        return res.status(500).json({ message: 'Failed to retrieve posts' });
    }
});


//End point for get a like 

app.post('/likeForAPost', async (req, res) => {
    try {
        // console.log('A1')
        const { postId, username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }
        // console.log('A2')

        const post = await Post.findById(postId);
        // console.log(post);
        if (!post) {
            return res.status(400).json({ message: "post doesn't exist" });
        }
        // console.log('A3')
        const alreadyLiked = await PostLikes.findOne({ username, postId });

        if (alreadyLiked) {
            await PostLikes.deleteOne({ username, postId });
            post.totalLikes--; 
            await post.save();
            return res.status(200).json({ message: "Like removed successfully" });
        }
        // console.log('A4')
        const newLike = new PostLikes({ username, postId });
        await newLike.save();
        // console.log('A5')
        post.totalLikes = post.totalLikes+ 1 ;
        await post.save();

        const NotificationMessage = `You have liked a Post of ${post.username} .`
        const newNotification = new Notification({username, message: NotificationMessage});
        await newNotification.save();

        const NotificationMessage2 = `${username} Liked your post .
        post : ${post.postContent}`
        const newNotification2 = new Notification({username:post.username, message: NotificationMessage2});
        await newNotification2.save();

        console.log('Liking a post successful');
        return res.status(200).json({ message: 'Like success' });
    } catch (error) {
        console.error("Error while fetching posts or username to like:", error);
        return res.status(500).json({ message: 'Error while fetching posts or username to like:' });
    }
});


//End point for Tweet to a Post

app.post('/tweetToAPost', async (req, res) => {
    try {
        const { postId, username, tweetContent } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({ message: "post doesn't exist" });
        }

        const newTweet = new PostTweets({ username, postId, tweet:tweetContent });
        await newTweet.save();
        post.totalTweets = post.totalTweets+ 1 ;
        await post.save();

        const NotificationMessage = `You have tweeted to a post of ${post.username} .
        post : ${post.postContent}`
        const newNotification = new Notification({username, message: NotificationMessage});
        await newNotification.save();

        const NotificationMessage2 = `${username} tweeted to your post.
        post : ${post.postContent}`
        const newNotification2 = new Notification({username: post.username, message: NotificationMessage2});
        await newNotification2.save();



        console.log('Tweeting a post successful');
        return res.status(200).json({ message: 'tweet success' });
    } catch (error) {
        console.error("Error while fetching posts or username to tweet:", error);
        return res.status(500).json({ message: 'Error while fetching posts or username to tweet:' });
    }
});

//End point for Tweet of a user that user tweeted....
app.post('/AllTweetsOfPosts', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }
        const tweetedPosts = await PostTweets.find({ username });

        const detailedTweets = await Promise.all(tweetedPosts.map(async (tweet) => {
            const originalPost = await Post.findById(tweet.postId).select('username profilepic postContent postImage');
            if (!originalPost) {
                return null;
            }
            return {
                ...tweet.toObject(), 
                username: originalPost.username,
                profilepic: originalPost.profilepic,
                post: originalPost.postContent,
                postImage: originalPost.postImage
            };
        }));
        const filteredTweets = detailedTweets.filter(tweet => tweet !== null);
        
        filteredTweets.reverse();
        return res.status(200).json({ tweetedPosts: filteredTweets });

    } catch (error) {
        console.error("Error while fetching username tweets -->  :", error);
        return res.status(500).json({ message: 'Error while fetching username tweets:' });
    }
});



// End point for Editing a tweet
app.post('/tweetToEdit', async (req, res) => {
    try {
        const { postId, username, tweetContent } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }
        
        const postTweet = await PostTweets.findById({_id: postId});
        if (!postTweet) {
            return res.status(400).json({ message: "post doesn't exist" });
        }
        postTweet.tweet = tweetContent;
        await postTweet.save();

        console.log('Editing a Tweet of a post successful');
        return res.status(200).json({ message: 'tweet success' });
    } catch (error) {
        console.error("Error while fetching Editing a Tweet of a postt:", error);
        return res.status(500).json({ message: 'Error while fetching Editing a Tweet of a post:' });
    }
});

// End point for Deleting a tweet
app.post('/tweetToDelete', async (req, res) => {
    try {
        const { postId, username, tweetContent } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        const deletedTweet = await PostTweets.findOneAndDelete({ _id: postId, username, tweet: tweetContent });
        if (!deletedTweet) {
            return res.status(400).json({ message: "Specific tweet not found" }); // More specific error message
        }

        const findPost = await Post.findById({_id: deletedTweet.postId});
        if (findPost) {
            findPost.totalTweets--;
            await findPost.save();
        }

        console.log('Deleting a Tweet of a post successful');
        return res.status(200).json({ message: 'Tweet successfully deleted' });
    } catch (error) {
        console.error("Error while deleting tweet:", error);
        return res.status(500).json({ message: 'Error while deleting tweet' });
    }
});

// End Point for forgot Password
app.post('/forgotPassword', async(req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ username, email });
        if(!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ message: 'Password change successful'});

    } catch (error) {
        console.error("Error while changing password:", error);
        return res.status(500).json({ message: 'Error while changing password' });
    }
});

// End point for retreiving all posts of a user and user details
app.post('/userPosts', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const AllMyPosts = await Post.find({ username });
        
        // Fetch tweets for each post
        const postsWithTweets = await Promise.all(AllMyPosts.map(async (post) => {
            const tweets = await PostTweets.find({ postId: post._id });
            return { ...post.toObject(), tweets };
        }));

        return res.status(200).json({ AllMyPosts: postsWithTweets, user });

    } catch (error) {
        console.error("Error while fetching username posts:", error);
        return res.status(500).json({ message: 'Error while fetching username posts:' });
    }
});


// Endpoint for editing a post
app.post('/editPost', async(req, res) => {
    try {
        const { postId, postContent } = req.body;
        const post = await Post.findById({_id: postId});
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.postContent = postContent;
        post.createdAtDate = Date.now();
        await post.save();
        return res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        console.error("Error while editing post:", error);
        return res.status(500).json({ message: 'Error while editing post' });
    }
});

// Endpoint for deleting Post
app.post('/deletePost', async(req, res) => {
    try {
        const { postId, username } = req.body;

        const post = await Post.findOneAndDelete({ _id: postId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await PostLikes.deleteMany({ postId: postId });
        await PostTweets.deleteMany({ postId: postId });

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }
        user.posts -= 1;
        await user.save();
        res.status(200).json({ message: 'Post deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Post deleted error' });
    }
});

// End point for retreiving all notifications of a user.
app.post('/userNotifications', async(req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

         // Delete expired notifications
         const twoHoursAgo = new Date(Date.now() - 2 * 60 *  60 * 1000);
         await Notification.deleteMany({ createdAtDate: { $lt: twoHoursAgo } });

        const AllMyNotifications = await Notification.find({username});
        return res.status(200).json({ AllMyNotifications });

    } catch (error) {
        console.error("Error while fetching username Notifications:", error);
        return res.status(500).json({ message: 'Error while fetching username Notifications:' });
    }
});

//End point for following a friend 
app.post('/FollowUser', async(req, res) => {
    try {
        const { username, following } = req.body;
        const user1 = await User.findOne({username});
        if (!user1) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user2 = await User.findOne({username: following});
        if (!user2) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newFollow = new Follow({username, following});
        await newFollow.save();

        user1.following = user1.following+1;
        user2.followers = user2.followers+1;
        await user1.save();
        await user2.save();

        const NotificationMessage = `You are following ${following} .`
        const newNotification = new Notification({username, message: NotificationMessage});
        await newNotification.save();

        const NotificationMessage2 = `${username} is following you.`
        const newNotification2 = new Notification({username: following, message: NotificationMessage2});
        await newNotification2.save();

        // console.log(" following done ---> username :: ", username, "following :: ", following );

        return res.status(200).json({ message: 'following success' });

    } catch (error) {
        console.error("Error while making friends :", error);
        return res.status(500).json({ message: 'Error while making friends :' });
    }
});

//End point for Unfollowing a friend 
app.post('/UnFollowUser', async(req, res) => {
    try {
        const { username, following } = req.body;
        const user1 = await User.findOne({username});
        if (!user1) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user2 = await User.findOne({username: following});
        if (!user2) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Follow.findOneAndDelete({ username, following });

        user1.following = user1.following-1;
        user2.followers = user2.followers-1;
        await user1.save();
        await user2.save();

        const NotificationMessage = `You have successfully unfollowed ${following} .`
        const newNotification = new Notification({username, message: NotificationMessage});
        await newNotification.save();

        const NotificationMessage2 = `${username} unfollowed you.`
        const newNotification2 = new Notification({username: following, message: NotificationMessage2});
        await newNotification2.save();

        // console.log("Un - following done ---> username :: ", username, "unfollowing :: ", following );

        return res.status(200).json({ message: 'unfollowing success' });

    } catch (error) {
        console.error("Error while un following friends :", error);
        return res.status(500).json({ message: 'Error while un following friends :' });
    }
});

// Endpoint for all following of a user
app.post('/AllFollowingList', async(req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const followingUsers = await Follow.find({username})

        return res.status(200).json({ followingUsers });

    } catch (error) {
        console.error("Error while AllFollowingList :", error);
        return res.status(500).json({ message: 'Error while AllFollowingList :' });
    }
});

// Endpoint for all followers of a user
app.post('/AllFollowersList', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const followers = await Follow.find({ following: username });

        // Fetch the list of users followed by the current user
        const followingUsers = await Follow.find({ username }).select('following');

        // Convert to a set for quick lookup
        const followingSet = new Set(followingUsers.map(f => f.following));

        // Mark if the current user follows each follower
        const followersList = await Promise.all(followers.map(async (follower) => {
            const isFollowing = followingSet.has(follower.username);
            return {
                ...follower.toObject(),
                isFollowing
            };
        }));

        return res.status(200).json({ followersList });

    } catch (error) {
        console.error("Error while fetching AllFollowersList:", error);
        return res.status(500).json({ message: 'Error while fetching AllFollowersList' });
    }
});

// Endpoint to fetch all users except those the user is following
app.post('/AllUsers', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        // Fetch all users except the logged-in user
        const allUsers = await User.find({ username: { $ne: username } });

        // Fetch the list of users the current user is following
        const followingUsers = await Follow.find({ username }).select('following');

        // Convert to a set for quick lookup
        const followingSet = new Set(followingUsers.map(f => f.following));

        // Filter out the users who are followed by the current user
        const filteredUsers = allUsers.filter(user => !followingSet.has(user.username));

        return res.status(200).json({ allUsers: filteredUsers });
    } catch (error) {
        console.error("Error while fetching users:", error);
        return res.status(500).json({ message: 'Failed to retrieve users' });
    }
});
