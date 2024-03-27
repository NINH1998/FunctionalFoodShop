const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // Erase if already required
const { type } = require('os');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
        avatar: {
            type: String,
        },
        firstname: {
            type: String,
        },
        lastname: {
            type: String,
        },
        googleFullName: String,
        googleId: String,
        avatar: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        emailAddress: {
            type: String,
        },
        address: {
            type: String,
        },
        phone: { type: String },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['pilgrims', 'enikk'],
            default: 'pilgrims',
        },
        cart: [
            {
                product: { type: mongoose.Types.ObjectId, ref: 'product' },
                quantity: Number,
            },
        ],
        address: String,
        wishlist: [{ product: { type: mongoose.Types.ObjectId, ref: 'product' } }],
        isBlocked: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
        },
        otpExpiration: {
            type: Date,
        },
        refreshToken: {
            type: String,
        },
        passwordChangeAt: {
            type: String,
        },
        passwordResetToken: {
            type: String,
        },
        passwordResetExpires: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods = {
    isCorrectPassword: async function (password) {
        const iscorrect = await bcrypt.compare(password, this.password);
        return iscorrect;
    },

    createPasswordChangeToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.passwordResetExpires = Date.now() + 60 * 1000;
        return resetToken;
    },
};

//Export the model
module.exports = mongoose.model('User', userSchema);
