const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
}, { timestamps: true });


userSchema.pre('save', function preSave(next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) next();

  // hash the password using with salt
  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    if (err) {
      next(err);
    }

    // override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});


userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  const pass = this.password;
  bcrypt.compare(candidatePassword, pass, (err, isMatch) => {
    if (err) {
      return cb(err);
    }

    return cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
