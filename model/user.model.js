// const mongoose = require('mongoose')
// const { Schema } = mongoose

// const usersSchema = new Schema ({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     approve: { type: Boolean, default: false }
// },{
//     timestamps: true
// })


// module.exports = mongoose.model('users', usersSchema);


const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const usersSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  approve: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Hash password before saving
usersSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Optional: method to compare password
usersSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = mongoose.model('users', usersSchema);
