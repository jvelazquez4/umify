import express, { urlencoded } from 'express';
import logger from 'morgan';
import { peopleDb } from '../database.js';

const router = express.Router();

function removeElement(element, array){
  array.splice(array.indexOf(element), 1);
}

// friends page
router.get('/friends', async (req, res) => {
    res.sendFile('client/friends-list/friendslist.html', { root: '.' });
});

// delete friend 
router.post('/deleteFriend', async (req, res) => {
    let info = req.body; 
    if ("curUser" in info && "friend" in info){
        //Remove from curUser
        let curInfo = await peopleDb.readUser(info.curUser);
        curInfo = curInfo.info;
        let friends = curInfo.friends;
        removeElement(info.friend, friends)
        curInfo.friends = friends;
        await peopleDb.updateUserInfo(info.curUser, curInfo);

        //Remove from friend 
        let friendInfo = await peopleDb.readUser(info.friend);
        friendInfo = friendInfo.info;
        let friendFriends = friendInfo.friends;
        removeElement(info.curUser, friendFriends);
        friendInfo.friends = friendFriends;
        await peopleDb.updateUserInfo(info.friend, friendInfo);
        res.status(200).json({"array": friends, "person": info.friend, "info": curInfo});
    }
    else {
        res.status(404);
    }
});

// add friend 
router.post('/addFriend', async (req, res) => {
    let inputInfo = req.body; 

    if ("user" in inputInfo && "friend" in inputInfo){
        let requestedFriend = inputInfo.friend;
        let currentUser = inputInfo.user; 

        let userInfo = await peopleDb.readUser(currentUser);
        userInfo = userInfo.info;
        let friendInfo = await peopleDb.readUser(requestedFriend);
        friendInfo = friendInfo.info;
        let userFriends = userInfo.friends;
        let reqPending = friendInfo.pending;

        //If the friends list does not already include the requested friend
        if(!userFriends.includes(requestedFriend)){
            //If the desired friend does not already have current friend pending 
            if(!reqPending.includes(currentUser)){
                //If the desired friend is in current user's pending friends
                if(userInfo.pending.includes(requestedFriend)){
                    //Remove it from current user's pending friends
                    userInfo.pending = removeElement(currentUser, userInfo.pending)
                    await peopleDb.updateUserInfo(requestedFriend, userInfo);

                    //Add it to friends for both parties
                    userInfo.friends.push(requestedFriend);
                    friendInfo.friends.push(currentUser);
                    await peopleDb.updateUserInfo(currentUser, userInfo);
                    await peopleDb.updateUserInfo(requestedFriend, friendInfo)
                }
                else{
                    // Else, add the current user to the pending array of the requested user
                    reqPending.push(currentUser)
                    friendInfo.pending = reqPending;
                    await peopleDb.updateUserInfo(requestedFriend, friendInfo);
                    res.status(200).json({"response": "Request sent!"});
                }
            }
            else{
                res.status(200).json({"response":"You already requested to be their friend!"});
            }
        }
        else {
            res.status(200).send({"response":"Friend already added"});
        }
    }
    else {
        res.status(404);
    }
});

//Accept a pending request
router.post('/acceptPending', async (req, res) => {
    let inputInfo = req.body;
    //Check that the needed information is present
    if ("user" in inputInfo && "friend" in inputInfo){
        let pendingFriend = inputInfo.friend;
        let currentUser = inputInfo.user; 
        let userInfo = await peopleDb.readUser(currentUser);
        userInfo = userInfo.info;
        let friendInfo = await peopleDb.readUser(pendingFriend);
        friendInfo = friendInfo.info;

        //Remove the pending friend from current users pending array 
        removeElement(pendingFriend, userInfo.pending)

        //Add the friend to current users friends array 
        userInfo.friends.push(pendingFriend);
        await peopleDb.updateUserInfo(currentUser, userInfo)

        //Add the friend to pending friends friend array
        friendInfo.friends.push(currentUser);
        await peopleDb.updateUserInfo(pendingFriend, friendInfo)
        res.status(200)
    }
    res.status(400)
})

//Deny pending request 
router.post('/denyPending', async (req, res) => {
    let inputInfo = req.body;
    if("user" in inputInfo && "pending" in inputInfo){
        let userInfo = await peopleDb.readUser(inputInfo.user);
        userInfo = userInfo.info;
        removeElement(inputInfo.pending, userInfo.pending);
        await peopleDb.updateUserInfo(inputInfo.user, userInfo);
        res.status(200);
    }
    res.status(400);
})

//Get all pending requests
router.post('/getPending', async (req, res) => {
    let inputInfo = req.body;
    if("user" in inputInfo){
        let info = await peopleDb.readUser(inputInfo.user);
        res.status(200).json(info)
    }
    res.status(400)
})

//Get all friends
router.post('/getFriends', async (req, res) => {
    let inputInfo = req.body;
    if("user" in inputInfo){
        let info = await peopleDb.readUser(inputInfo.user);
        res.status(200).json(info)
    }
    res.status(400)
})

export {router};