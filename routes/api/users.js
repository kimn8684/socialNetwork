const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Load input validator
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load user model
const User = require('../../models/User');

//@route POST api/users/register
//@desc Register new user
//@access public
router.post('/register', (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);

    //check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
    .then(user => {
        if (user) {
            return res.status(400).json({email: 'Email already exist'});
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar
            });

            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    return res.status(400).json({password: 'Failed encryping'});
                }
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({password: 'Failed hashing'});
                    }
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                })
            })   
        }
    })   
    .catch(err => console.log(err));
});

//@route POST api/users/login
//@desc Login user
//@access public
router.post('/login', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);

    //Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
        if (!user) {
            return res.status(404).json({email: 'User not found'});        
        }
            
        //Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        //User matched
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        };
                        //Sign token
                        jwt.sign(payload,
                            keys.secretOrKey,
                            {expiresIn: 3600},
                            (err, token) => {
                                return res.json({
                                    success:true,
                                    token: 'Bearer ' + token
                                });
                            }
                        )
                    } else {
                        return res.status(400).json({password: 'password incorrect'});
                    }
                });
                
        })
        .catch(err => console.log(err));
})

//@route GET api/users/current
//@desc Returns current user infomation
//@access private
router.get(
    '/current',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        res.json({
        name: req.user.name,
        id: req.user.id,
        email: req.user.email
        });
    }
)

module.exports = router;