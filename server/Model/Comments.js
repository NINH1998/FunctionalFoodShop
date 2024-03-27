const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const commentSchema = new mongoose.Schema(
    {
        text: String,
        postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
        commentOn: { type: mongoose.Types.ObjectId, ref: 'product' },
        likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
        dislikes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
        replies: [
            {
                text: String,
                repliedAt: { type: Date, default: Date.now() },
                postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
                likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
                dislikes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
            },
        ],
    },
    {
        timestamps: true,
    },
);

//Export the model
module.exports = mongoose.model('comment', commentSchema);
