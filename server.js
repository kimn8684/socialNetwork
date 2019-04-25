const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
const bodyparser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

//Body parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extend: false}))

//connect to db
mongoose
	.connect(db)
	.then(() => console.log('mondoDB connected'))
	.catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);

//routes
app.get('/', (req, res) => res.send('Hello!'));
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

//port setting
const port = process.env.PORT || 5300;
app.listen(port, () => console.log(`server running on port ${port}`));

