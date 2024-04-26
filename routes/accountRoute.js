const express = require("express")
const Account = require("../models/Account")
const router = express.Router();
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

router.post("/balance", async (req, res) => {

    const token = jwt.decode(req.body.userId)
    const userId = token.userId;

    const user = await Account.findOne({
        userId
    })

    res.json({ balance: user.balance })
})

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, "secret");

        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({});
    }
};

router.post("/transfer", authMiddleware, async (req, res) => {

    const {to , amount} = req.body;
    const userId = req.userId;
    console.log(userId)
    try {
        const account = await Account.findOne({userId})
        console.log(account.balance)
        if(!account || account.balance < amount){
            return res.json({message:"Insufficent funds" , status:false})
        }

        const toAccount = await Account.findOne({userId : to})

        if(!toAccount){
            return res.json({message:"Invalid account" , status:false})
        }

        await Account.findOneAndUpdate({userId},{balance: account.balance - amount})
        await Account.findOneAndUpdate({userId:to} , {balance: toAccount.balance + amount})

    } catch (error) {
        
    }
    return res.json({message:"Transfer Successfull", status:true})

});

module.exports = router