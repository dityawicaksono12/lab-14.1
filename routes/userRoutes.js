const router = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

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

// POST on /api/users/login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(400).json({ message: 'Incorrect email or password.' })
        }

        const isCorrectPassword = await user.isCorrectPassword(req.body.password)

        if (!isCorrectPassword) {
            return res.status(400).json({ message: 'Incorrect email or password.' })
        }

        const payload = {
            _id: user._id,
            username: user.username,
        }

        const token = jwt.sign(
            { data: payload },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )

        const userObj = user.toObject()
        delete userObj.password

        res.json({ token, user: userObj })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error during login.' })
    }
})


module.exports = router