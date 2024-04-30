const Queue = require('bull');
const { REDIS_URI, REDIS_PORT, REDIS_PASSWORD } = require('../Config/Redis');

const redisConfig = {
    redis: {
        host: REDIS_URI,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
    },
};
const likeQueue = new Queue('likeQueue', redisConfig);
const dislikeQueue = new Queue('dislikeQueue', redisConfig);
const likeReplyQueue = new Queue('likeReplyQueue', redisConfig);
const dislikeReplyQueue = new Queue('dislikeReplyQueue', redisConfig);
const orderQueue = new Queue('orderQueue', redisConfig);
const commentSchema = require('../Model/Comments');
const StoreSchema = require('../Model/Product');
const Bill = require('../Model/Bill');

likeQueue.process(async (job, done) => {
    const { commentId, _id } = job.data;
    try {
        const comment = await commentSchema.findById(commentId);
        const exitingLike = comment.likes.find((like) => like._id.toString() === _id);
        if (!exitingLike) {
            await commentSchema.findByIdAndUpdate(
                commentId,
                { $push: { likes: _id }, $pull: { dislikes: _id } },
                { new: true },
            );
            done();
        } else {
            await commentSchema.findByIdAndUpdate(commentId, { $pull: { likes: _id } }, { new: true });
            done();
        }
    } catch (error) {
        console.log(error);
    }
});

dislikeQueue.process(async (job, done) => {
    try {
        const { commentId, _id } = job.data;
        const comment = await commentSchema.findById(commentId);
        const exitingDislike = comment.dislikes.find((dislike) => dislike._id.toString() === _id);
        if (!exitingDislike) {
            await commentSchema.findByIdAndUpdate(
                commentId,
                { $push: { dislikes: _id }, $pull: { likes: _id } },
                { new: true },
            );
            done();
        } else {
            await commentSchema.findByIdAndUpdate(commentId, { $pull: { dislikes: _id } }, { new: true });
            done();
        }
    } catch (error) {
        console.log(error);
    }
});

likeReplyQueue.process(async (job, done) => {
    const { commentId, _id, replyId } = job.data;
    try {
        const comment = await commentSchema.findById(commentId);
        const existingReplies = comment.replies.id(replyId);
        const existingLike = existingReplies.likes.find((like) => like._id.toString() === _id);
        if (!existingLike) {
            existingReplies.likes.push(_id);
            existingReplies.dislikes.pull(_id);
        } else {
            existingReplies.likes.pull(_id);
        }
        await comment.save();
        done();
    } catch (error) {
        console.log(error);
    }
});

dislikeReplyQueue.process(async (job, done) => {
    const { commentId, _id, replyId } = job.data;
    try {
        const comment = await commentSchema.findById(commentId);
        const existingReplies = comment.replies.id(replyId);
        const existingDislike = existingReplies.dislikes.find((dislike) => dislike._id.toString() === _id);
        if (!existingDislike) {
            existingReplies.dislikes.push(_id);
            existingReplies.likes.pull(_id);
        } else {
            existingReplies.dislikes.pull(_id);
        }
        await comment.save();
        done();
    } catch (error) {
        console.log(error);
    }
});

orderQueue.process(async (job, done) => {
    const { products, total, _id, payments, name, phone, emailAddress, subName, subPhone, address } = job.data;

    try {
        if (_id) {
            for (const { product, quantity } of products) {
                const pd = await StoreSchema.findById({ _id: product._id });
                if (pd) {
                    pd.sold += quantity;
                    if (pd.quantity !== 0) product.quantity -= quantity;
                }
                await pd.save();
            }
            await Bill.create({
                products,
                total,
                orderBy: _id,
                payments,
                emailAddress,
                buyer: { name, phone },
                receiver: { subName, subPhone },
                address,
            });
        } else {
            await Bill.create({
                products,
                total,
                payments,
                emailAddress,
                buyer: { name, phone },
                receiver: { subName, subPhone },
                address,
            });
        }
        done();
    } catch (error) {
        console.log(error);
    }
});
