import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { apiDeleteReply, apiEditReply } from 'Context/StoreApi/Comments';
import { Button, IconsButton } from 'Layouts/Component/public/Common';
import { Icons } from 'Layouts/Assets/icons';
import { toast } from 'react-toastify';
import withComponent from 'Hocs/withComponent';
import CommentBox from '../CommentBox';
import DOMPurify from 'dompurify';

const { BsThreeDots } = Icons;

const EditReply = ({
    replyItem,
    setCommentText,
    commentText,
    comment,
    setUpdate,
    update,
    current,
    setIsLoadingReply,
}) => {
    const [showMenuEdit, setShowMenuEdit] = useState(false);
    const [showDots, setShowDots] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const menuRef = useRef(null);

    const handleSendEditReply = useCallback(async () => {
        setIsLoadingReply(true);
        const response = await apiEditReply({
            editedReply: commentText,
            replyId: replyItem?._id,
            commentId: comment._id,
        });
        setIsLoadingReply(false);
        if (response.success) {
            setIsEdit(false);
            setUpdate(!update);
            toast.success(response.message);
        } else toast.error(response.message);
        // eslint-disable-next-line
    }, [commentText]);

    const handleDeleteReply = async () => {
        setIsLoadingReply(true);
        const response = await apiDeleteReply({ commentId: comment._id, replyId: replyItem?._id });
        setIsLoadingReply(false);
        if (response.success) {
            setUpdate(!update);
            toast.success(response.message);
        } else toast.error(response.message);
    };

    const handleEditComment = () => {
        setIsEdit(true);
        setShowMenuEdit(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenuEdit(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <>
            {isEdit ? (
                <CommentBox
                    el={replyItem}
                    handleOnclick={handleSendEditReply}
                    setCommentText={setCommentText}
                    setIsEdit={setIsEdit}
                    editBox
                />
            ) : (
                <div
                    className="flex w-full items-center gap-2"
                    onMouseEnter={() => setShowDots(true)}
                    onMouseLeave={() => setShowDots(false)}
                >
                    <p
                        className="p-2 text-sm break-all bg-gray-100 rounded-lg"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(replyItem?.text) }}
                    ></p>
                    {replyItem?.postedBy?._id === current?._id && (
                        <div className="relative" ref={menuRef}>
                            <IconsButton
                                styles={`${showDots && 'opacity-[1]'} opacity-0 cursor-pointer`}
                                handleOnclick={() => setShowMenuEdit(!showMenuEdit)}
                                icon={<BsThreeDots />}
                            />
                            {showMenuEdit && (
                                <div className="absolute left-[20px] bg-white shadow-small flex flex-col justify-center items-center z-10">
                                    <Button
                                        styles="px-4 py-1 text-sm cursor-pointer hover:bg-gray-100 font-semibold"
                                        handleOnclick={handleEditComment}
                                    >
                                        Sửa
                                    </Button>
                                    <Button
                                        styles="px-4 py-1 text-sm cursor-pointer hover:bg-gray-100 font-semibold"
                                        handleOnclick={handleDeleteReply}
                                    >
                                        Xóa
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default withComponent(memo(EditReply));
