import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 15,
    },

    password:{
        type: String,
        required: true,
        minlength: 8,
    },

    firstname:{
        type: String,
        required: true,
        trim: true,
        maxlength: 10,
    },

    lastname:{
        type: String,
        required: true,
        trim: true,
        maxlength: 10,
    }
});


export const User = mongoose.model('User', userSchema);

