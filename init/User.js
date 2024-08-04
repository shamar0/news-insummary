// models/User.js
const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  savedArticles: [
    { type: mongoose.Schema.Types.ObjectId, 
      ref: 'News' 
    }
],
});

module.exports = mongoose.model('User', UserSchema);
