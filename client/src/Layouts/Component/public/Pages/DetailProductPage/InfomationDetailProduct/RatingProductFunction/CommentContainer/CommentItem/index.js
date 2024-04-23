import { apiCreateReplies, apiDislikeComment, apiLikeComment } from 'Context/StoreApi/Comments';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { showLoginModal } from 'Context/Reducer/AppState/CommonAction';
import { Icons, Images } from 'Layouts/Assets/icons';
import { createSlug } from 'Ultils/helper';
import { BeatLoader } from 'react-spinners';
import { Loading } from 'Layouts/Component/public/Common';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import withComponent from 'Hocs/withComponent';
import EditComment from './EditComment';
import CommentBox from '../CommentBox';
import ReplyItem from '../ReplyItem';
import moment from 'moment';
import Swal from 'sweetalert2';
import 'moment/locale/vi';

const { AiFillLike, AiFillDislike, AiOutlineDislike, AiOutlineLike } = Icons;

const CommentItem = ({ comment, current, setUpdate, update, dispatch }) => {
    const [isReply, setIsReply] = useState(false);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likedCount, setLikedCount] = useState(comment.likes.length);
    const [dislikedCount, setDislikedCount] = useState(comment.dislikes.length);
    const [commentText, setCommentText] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [isUserAnswering, setIsUserAnswering] = useState(null);
    const [isLoadingComment, setIsLoadingComment] = useState(null);
    const contentEditableRef = useRef(null);
    const scrollToCommentRef = useRef(null);

    useEffect(() => {
        if (isReply) {
            const paragrah = document.createElement('p');
            const tagName = document.createElement('span');
            const ReplyContent = document.createElement('span');
            const existing = comment.replies.find((reply) => reply._id === isUserAnswering);
            tagName.innerHTML = existing
                ? existing.postedBy?.firstname + ' ' + existing.postedBy?.lastname
                : comment.postedBy?.firstname + ' ' + comment.postedBy?.lastname;
            tagName.id = 'tagName';
            tagName.style.fontWeight = '600';
            tagName.style.background = '#dbeafe';
            ReplyContent.innerHTML = '&nbsp;';

            const currentRef = contentEditableRef.current;
            currentRef.appendChild(paragrah);
            paragrah.appendChild(ReplyContent);
            paragrah.insertBefore(tagName, paragrah.firstChild);
        }
        // eslint-disable-next-line
    }, [isReply]);

    const showComment = () => {
        const tagName = document.getElementById('tagName');
        if (tagName) tagName.innerHTML = comment.postedBy?.firstname + ' ' + comment.postedBy?.lastname;
        setIsReply(true);
        const rect = scrollToCommentRef.current.getBoundingClientRect();
        if (scrollToCommentRef.current && rect.bottom >= window.innerHeight + 50 && rect.top >= 0)
            scrollToCommentRef.current.scrollIntoView({ behavior: 'auto' });
    };

    const handleLike = async (cid) => {
        if (current?._id) {
            setLiked(!liked);
            setLikedCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
            setDislikedCount((prevCount) => (disliked ? prevCount - 1 : prevCount));
            setDisliked(false);
            const rs = await apiLikeComment(cid);
            if (rs.success) setUpdate(!update);
        } else
            Swal.fire({
                text: 'Bạn cần phải đăng nhập để thực hiện chức năng này!',
                showCancelButton: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    dispatch(showLoginModal({ isOpenLoginModal: true }));
                }
            });
    };

    const handleDislike = async (cid) => {
        if (current?._id) {
            setDisliked(!disliked);
            setDislikedCount((prevCount) => (disliked ? prevCount - 1 : prevCount + 1));
            setLikedCount((prevCount) => (liked ? prevCount - 1 : prevCount));
            setLiked(false);
            const rs = await apiDislikeComment(cid);
            if (rs.success) setUpdate(!update);
        } else
            Swal.fire({
                text: 'Bạn cần phải đăng nhập để thực hiện chức năng này!',
                showCancelButton: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    dispatch(showLoginModal({ isOpenLoginModal: true }));
                }
            });
    };

    let userToken = localStorage.getItem('user');
    userToken = JSON.parse(userToken);
    useEffect(() => {
        if (comment.likes?.find((like) => like === current?._id)) setLiked(true);
        if (comment.dislikes?.find((dislike) => dislike === current?._id)) setDisliked(true);
        // eslint-disable-next-line
    }, [userToken]);

    const handleSubmitReply = useCallback(
        async (cid) => {
            const response = await apiCreateReplies({ reply: commentText }, cid);
            if (response.success) {
                setUpdate(!update);
                setIsReply(false);
                contentEditableRef.current.innerHTML = '';
                toast.success(response.message);
            } else toast.error(response.message);
        },
        // eslint-disable-next-line
        [commentText],
    );

    useEffect(() => {
        moment.locale('vi');
    }, []);

    return (
        <div className="flex gap-2 mb-6">
            <img
                className="w-[60px] h-[60px] object-fill rounded-full"
                src={comment.postedBy?.avatar || Images.AvatarDefault}
                alt="Avatar"
            />
            <div className="flex flex-col items-start w-full">
                <div className="flex items-center whitespace-nowrap">
                    <h4>{`${comment.postedBy?.firstname} ${comment.postedBy?.lastname}`}</h4>
                    <span className="ml-2 tablet:text-xs phone:text-sm text-gray-500">
                        {moment(comment.createdAt).fromNow()}
                    </span>
                    <Link
                        to={`/${createSlug(comment?.commentOn?.category)}/${comment?.commentOn?._id}/${createSlug(
                            comment?.commentOn?.title,
                        )}`}
                        className="text-sm ml-2 p-[2px] bg-gray-100 hover:text-secondary rounded-md text-primary cursor-pointer"
                    >
                        {comment?.commentOn?.title}
                    </Link>
                </div>
                <EditComment
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    setCommentText={setCommentText}
                    comment={comment}
                    commentText={commentText}
                    update={update}
                    setUpdate={setUpdate}
                    setIsLoadingComment={setIsLoadingComment}
                />
                <div className="flex items-center justify-start gap-2 mt-1 w-[200px]">
                    <div className="flex items-center gap-1">
                        <span onClick={() => handleLike(comment._id)} className="hover:scale-110 cursor-pointer">
                            {liked ? <AiFillLike color="#db2777" /> : <AiOutlineLike />}
                        </span>
                        <span className="text-sm font-semibold">{likedCount}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-1">
                        <span onClick={() => handleDislike(comment._id)} className="hover:scale-110 cursor-pointer">
                            {disliked ? <AiFillDislike color="#db2777" /> : <AiOutlineDislike />}
                        </span>
                        <span className="text-sm font-semibold">{dislikedCount}</span>
                    </div>
                    <span onClick={showComment} className="text-sm hover:text-main hover:underline cursor-pointer">
                        Trả lời
                    </span>
                    {isLoadingComment && <Loading shape={<BeatLoader size={6} color="gray" />} />}
                </div>
                <div ref={scrollToCommentRef} className="w-full">
                    {comment.replies?.map((r) => (
                        <ReplyItem
                            key={r._id}
                            replyItem={r}
                            comment={comment}
                            current={current}
                            setIsUserAnswering={setIsUserAnswering}
                            isUserAnswering={isUserAnswering}
                            setIsReply={setIsReply}
                            ref={scrollToCommentRef}
                            setCommentText={setCommentText}
                            commentText={commentText}
                            setUpdate={setUpdate}
                            update={update}
                        />
                    ))}

                    {isReply && (
                        <CommentBox
                            ref={contentEditableRef}
                            el={comment}
                            handleOnclick={handleSubmitReply}
                            setCommentText={setCommentText}
                            setIsEdit={setIsEdit}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default withComponent(memo(CommentItem));
