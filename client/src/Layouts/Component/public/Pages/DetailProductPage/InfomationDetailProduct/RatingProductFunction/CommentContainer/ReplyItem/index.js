import { apiDislikeReply, apiLikeReply } from 'Context/StoreApi/Comments';
import { forwardRef, memo, useEffect, useState } from 'react';
import { Icons, Images } from 'Layouts/Assets/icons';
import { BeatLoader } from 'react-spinners';
import { Loading } from 'Layouts/Component/public/Common';
import EditReply from './EditReply';
import moment from 'moment';

const { AiFillLike, AiFillDislike, AiOutlineDislike, AiOutlineLike, BsThreeDots } = Icons;

const ReplyItem = forwardRef(
    (
        { replyItem, comment, current, setIsReply, setIsUserAnswering, setCommentText, commentText, setUpdate, update },
        ref,
    ) => {
        const [likedReply, setlikedReply] = useState(false);
        const [dislikedReply, setDislikedReply] = useState(false);
        const [likedReplyCount, setLikedReplyCount] = useState(replyItem?.likes.length);
        const [dislikedreplyCount, setDislikedReplyCount] = useState(replyItem?.dislikes.length);
        const [isLoadingReply, setIsLoadingReply] = useState(false);

        const handleLike = async () => {
            setlikedReply(!likedReply);
            setLikedReplyCount((prevCount) => (likedReply ? prevCount - 1 : prevCount + 1));
            setDislikedReplyCount((prevCount) => (dislikedReply ? prevCount - 1 : prevCount));
            setDislikedReply(false);
            await apiLikeReply({ commentId: comment._id, replyId: replyItem?._id });
        };

        const handleDislike = async () => {
            setDislikedReply(!dislikedReply);
            setDislikedReplyCount((prevCount) => (dislikedReply ? prevCount - 1 : prevCount + 1));
            setLikedReplyCount((prevCount) => (likedReply ? prevCount - 1 : prevCount));
            setlikedReply(false);
            await apiDislikeReply({ commentId: comment._id, replyId: replyItem?._id });
        };

        let userToken = localStorage.getItem('user');
        userToken = JSON.parse(userToken);
        useEffect(() => {
            if (replyItem?.likes?.find((like) => like === current?._id)) setlikedReply(true);
            if (replyItem?.dislikes?.find((dislike) => dislike === current?._id)) setDislikedReply(true);
            // eslint-disable-next-line
        }, [userToken]);

        const handleReply = () => {
            const tagName = document.getElementById('tagName');
            if (tagName) tagName.innerHTML = replyItem?.postedBy?.firstname + ' ' + replyItem?.postedBy?.lastname;
            const rect = ref.current.getBoundingClientRect();
            if (rect.bottom >= window.innerHeight + 50 && rect.top >= 0)
                ref.current.scrollIntoView({ behavior: 'smooth' });
            setIsUserAnswering(replyItem?._id);
            setIsReply(true);
        };

        return (
            <div className="flex gap-2 mt-6">
                <img
                    className="w-[50px] h-[50px] object-fill rounded-full"
                    src={replyItem?.postedBy?.avatar || Images.AvatarDefault}
                    alt=""
                ></img>
                <div className="flex flex-col items-start w-full">
                    <div className="flex items-center">
                        <h4 className="text-sm">{`${replyItem?.postedBy?.firstname} ${replyItem?.postedBy?.lastname}`}</h4>
                        <span className="ml-2 text-[12px]">{moment(replyItem.createdAt).fromNow()}</span>
                    </div>
                    <EditReply
                        setIsLoadingReply={setIsLoadingReply}
                        replyItem={replyItem}
                        setCommentText={setCommentText}
                        commentText={commentText}
                        comment={comment}
                        setUpdate={setUpdate}
                        update={update}
                    />
                    <div className="flex items-center justify-start gap-2 mt-1 w-[200px]">
                        <div className="flex items-center gap-1">
                            <span onClick={handleLike} className="hover:scale-110 cursor-pointer">
                                {likedReply ? <AiFillLike color="#db2777" /> : <AiOutlineLike />}
                            </span>
                            <span className="text-sm font-semibold">{likedReplyCount}</span>
                        </div>
                        <div className="flex items-center gap-1 ml-1">
                            <span onClick={handleDislike} className="hover:scale-110 cursor-pointer">
                                {dislikedReply ? <AiFillDislike color="#db2777" /> : <AiOutlineDislike />}
                            </span>
                            <span className="text-sm font-semibold">{dislikedreplyCount}</span>
                        </div>
                        <span onClick={handleReply} className="text-sm hover:text-main hover:underline cursor-pointer">
                            Trả lời
                        </span>
                        {isLoadingReply && <Loading shape={<BeatLoader size={4} color="gray" />} />}
                    </div>
                </div>
            </div>
        );
    },
);

export default memo(ReplyItem);
