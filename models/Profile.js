const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    customURL: {    
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    website: {
        type: String
    },
    phonenumber: {
        type: Number
    },
    gender: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },

});

module.exports = Profile = mongoose.model('profile', ProfileSchema);