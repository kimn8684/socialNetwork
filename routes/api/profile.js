const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load input validator
const validateProfileInput = require('../../validation/profile');
//Load profile model
const Profile = require('../../models/Profile');
//Load user model
const User = require('../../models/User');

// @route GET api/profile
// @desc Get Current user page
// @access Private
router.get('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors ={};

    Profile.findOne({user: req.user.id})
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no page for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post('/',
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.customURL) profileFields.customURL = req.body.customURL;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.phonenumber) profileFields.phonenumber = req.body.phonenumber;
    if (req.body.gender) profileFields.gender = req.body.gender;
    
    Profile.findOne({user: req.user.id})
      .then(profile => {
        if (profile) {
          // Update
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          ).then(profile => res.json(profile))
           .catch(err => res.status(400).json(err));
        } else {
          // Create and save Profile
          new Profile(profileFields)
           .save()
           .then(profile => res.json(profile))
           .catch(err => res.status(400).json(err));
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route   GET api/profile/customURL/:customURL
// @desc    Get page by customURL
// @access  Public
router.get('/customURL/:customURL', (req, res) => {
    const errors = {};
  
    Profile.findOne({customURL: req.params.customURL})
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no page for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(400).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get page by user ID
// @access  Public
router.get('user/:user_id', (req, res) => {
    const errors = {};
  
    Profile.findOne({user: req.params.user_id})
      .populate('user', ['name', 'avatar'])
        .then(profile => {
          if (!profile) {
            errors.noprofile = 'There is no page for this user';
            return res.status(404).json(errors);
          }
          res.json(profile);
        })
        .catch(err => res.status(400).json(err));
});



module.exports = router;