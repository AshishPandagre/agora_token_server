require('dotenv').config();

const express = require('express');
const app = express();
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const PORT = 8080;

const nocache = (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragme', 'no-cache');
    next();
}

const generateAccessToken = (req, res) => {
    // get response header
    res.header('Access-Control-Allow-Origin', '*');

    // get channel name
    const channelName = req.query.channelName;
    if(!channelName) return res.status(400).json({'error': "Channel name required"});

    // get uid
    let uid = req.query.uid;
    if(!uid || uid==='') uid = 0; 

    // get role
    let role = RtcRole.PUBLISHER;

    // get expiry date
    let expireTime = 3600000;

    // privelege expire time
    const currentTime = Math.floor(Date.now()/1000);
    const privelegeExpireTime = currentTime + expireTime;

    // build token
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privelegeExpireTime);

    // return token
    return res.json({token: token});
}

app.get('/access_token', nocache, generateAccessToken);

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})