const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
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
