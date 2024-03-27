import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { apiCreateComment, apiGetComments } from 'Context/StoreApi/Comments';
import { showLoginModal } from 'Context/Reducer/AppState/CommonAction';
import { BeatLoader } from 'react-spinners';
import { Button, Loading } from 'Layouts/Component/public/Common';
import { toast } from 'react-toastify';
import withComponent from 'Hocs/withComponent';
import CommentItem from './CommentItem';
import Swal from 'sweetalert2';

const CommentContainer = ({ current, dispatch, useSelector }) => {
    const { product } = useSelector((state) => state.productsReducer);
    const [comment, setComment] = useState('');
    const contentEditableRef = useRef(null);
    const [update, setUpdate] = useState(false);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [commentCount, setCommentCount] = useState(false);
    const [page, setPage] = useState(1);

    const fetchComments = async () => {
        setIsLoading(true);
        const response = await apiGetComments({ limit: 5 * page });
        setIsLoading(false);
        if (response.success) {
            setCommentCount(response.counts);
            setComments(response.comments);
        }
    };

    const handleSeemore = async () => {
        setPage(page + 1);
    };

    useEffect(() => {
        fetchComments();
    }, [update, page]);

    const handleContentChange = () => {
        setComment(contentEditableRef.current.innerHTML);
    };

    const handleSendComment = useCallback(async () => {
        if (current) {
            const response = await apiCreateComment({ comment, productId: product._id });
            if (response.success) {
                setUpdate(!update);
                contentEditableRef.current.innerHTML = '';
                toast.success(response.message);
            } else toast.error(response.message);
        } else {
            Swal.fire({
                text: 'Bạn cần đăng nhập để thực hiện hành động này!',
                showCancelButton: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    dispatch(showLoginModal({ isOpenLoginModal: true }));
                }
            });
        }
        // eslint-disable-next-line
    }, [comment]);
    return (
        <div className="flex flex-col gap-2">
            <h4>Bình luận:</h4>
            <div
                className="outline-none text-sm border bg-gray-50 border-gray-300 p-4 w-full h-[100px] overflow-auto rounded-[16px]"
                ref={contentEditableRef}
                onInput={handleContentChange}
                contentEditable
            />
            <div className="text-end">
                <Button handleOnclick={handleSendComment}>Gửi</Button>
            </div>
            {comments?.map((el) => (
                <CommentItem key={el._id} comment={el} update={update} setUpdate={setUpdate} />
            ))}
            {comments.length !== commentCount && (
                <div className="w-full flex justify-center">
                    <div
                        onClick={handleSeemore}
                        className="flex items-center justify-center px-2 py-1 w-[300px] min-h-[32px] font-semibold
                      bg-gray-100 hover:bg-gray-200 animation-200 rounded-md cursor-pointer"
                    >
                        {isLoading ? <Loading shape={<BeatLoader size={8} color="#65a30d" />} /> : 'Xem thêm bình luận'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default withComponent(memo(CommentContainer));
