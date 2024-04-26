const express = require("express")
const zod = require("zod")
const USER = require("../models/User")
const jwt = require("jsonwebtoken")
const Account = require("../models/Account")
const router = express.Router();

const signUpBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
})

const signInBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
})

const updateBody = zod.object({
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string().optional(),
})

router.post("/signup", async (req, res) => {
    const { success } = signUpBody.safeParse(req.body)
    if (!success) {
        return res.json({ message: "Incorrect inputs" , status:false })
    }

    const user = await USER.findOne({
        username: req.body.username
    })

    if (user) {
        return res.json({ message: "Incorrect inputs" , status:false })
    }

    const newUser = await USER.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
    })

    const userId = newUser._id

    const token = jwt.sign({ userId }, "secret")

    if (newUser) {

        await Account.create({
            userId:newUser._id,
            balance:10000
        })

        return res.json({ message: "User created Succesfully", token: token , status:true })
    }

})

router.post("/signin", async (req, res) => {

    const { success } = signInBody.safeParse(req.body)
    if (!success) {
        return res.json({ message: "Incorrect inputs" })
    }

    const user = await USER.findOne({
        username: req.body.username
    })

    if (!user) {
        return res.json({ message: "Incorrect inputs" , status:false })
    }
    
    const userId = user._id;
    if(req.body.password == user.password){
        const token = jwt.sign({ userId }, "secret")
        return res.json({ message: "User found Succesfully", token: token , status:true })
    }
    else{
        return res.json({ message: "Incorrect inputs" , status:false })
    }


})

router.post("/", async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        return res.json({ message: "Incorrect inputs" })
    }

    const user = await USER.updateOne(req.body, { id: req.body.userId })

    res.json({ message: "Updated Successfully" })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await USER.find({
        $or: [{
            firstName: {
                "$regex": filter
            },
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({ users: users })
})

module.exports = router;