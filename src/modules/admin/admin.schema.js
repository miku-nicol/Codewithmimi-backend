const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const Schema = mongoose.Schema

const adminSchema = new Schema (
    {
        email:{
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },

        password:{
            type: String,
            trim: true,
            required: true,
            select: false, 
        },

        failLoginAttempts:{
            type: Number,
            default: 0,
        },

        lastLogin:{
            type: Date
        },

        lockUntil: {
            type: Date,
            default: null,
        }
    },
    { timestamps: true }
);

// hash password before saving
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch (err) {
        next(err);
    }
});

// compare password for login

adminSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);