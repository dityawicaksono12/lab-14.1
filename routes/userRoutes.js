const router = require('express').Router()
const User = require('../models/User')

// POST on /api/users/registers
router.post('/register', async (req, res) => {
    try {
        // is user exists?
        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' })
        }
        // create new user
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })

        // exclude password from the response
        const userObj = newUser.toObject()
        delete userObj.password

        res.status(201).json(userObj)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error during registration.'})
    }
})

// login route //

module.exports = router