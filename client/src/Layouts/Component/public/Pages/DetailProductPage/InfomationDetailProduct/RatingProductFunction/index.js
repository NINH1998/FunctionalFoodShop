import { memo, useCallback, useState } from 'react';
import { showLoginModal } from 'Context/Reducer/AppState/CommonAction';
import { starNumber } from 'Ultils/helper';
import { apiRating } from 'Context/StoreApi/Products';
import { Button } from 'Layouts/Component/public/Common';
import withComponent from 'Hocs/withComponent';
import RatingComment from './RatingComment';
import VoteOptions from './VoteOptions';
import VotingBar from './VotingBar';
import ModalUI from 'Layouts/Component/public/Common/ModalUI';
import Swal from 'sweetalert2';

const RatingProductFunction = ({ pid, productName, ratings, totalRatings, setUpdateRating, dispatch, current }) => {
    const [isVote, setIsVote] = useState(false);

    const handleSubmitVote = useCallback(
        async ({ comment, score }) => {
            const response = await apiRating({ star: score, comment, pid, commentAt: Date.now() });
            if (response.success) {
                Swal.fire('', response.message, 'success');
            }
            setUpdateRating(Math.random());
        },
        [pid, setUpdateRating],
    );

    const handleVoteNow = useCallback(
        ({ comment, score }) => {
            setIsVote(false);

            handleSubmitVote({ comment, score });
        },
        // eslint-disable-next-line
        [pid],
    );

    const handleOpenVoteModal = useCallback(() => {
        if (!current) {
            Swal.fire({
                text: 'Bạn cần đăng nhập để đánh giá',
                showCancelButton: true,
                confirmButtonText: 'Đăng nhập',
                cancelButtonText: 'Hủy bỏ',
            }).then((rs) => {
                if (rs.isConfirmed) {
                    dispatch(showLoginModal({ isOpenLoginModal: true }));
                }
            });
        } else {
            setIsVote(true);
        }
        // eslint-disable-next-line
    }, [current]);

    const handlecloseVoteModal = useCallback(() => {
        setIsVote(false);
    }, []);

    return (
        <div>
            <div className="flex phone:flex-col laptop:flex-row">
                <div className="flex-4 p-4 border-2 flex flex-col items-center justify-center">
                    <h3 className="">{totalRatings}/5</h3>
                    <span className="flex">{starNumber(totalRatings)}</span>
                    <span className="text-sm py-2">
                        {ratings?.length ? `${ratings?.length} Lượt đánh giá` : 'Chưa có ai đánh giá sản phẩm này'}
                    </span>
                    <Button handleOnclick={handleOpenVoteModal}>Đánh giá</Button>
                </div>
                <div className="flex-6 border-[1px] flex flex-col gap-2 p-4 overflow-x-auto">
                    {Array.from(Array(5).keys())
                        .reverse()
                        .map((el, index) => (
                            <VotingBar
                                key={index}
                                number={el + 1}
                                ratingCount={ratings?.filter((i) => i.star === el + 1).length}
                                totalRating={ratings?.length}
                            />
                        ))}
                </div>
                <ModalUI isOpen={isVote} onClose={handlecloseVoteModal}>
                    <VoteOptions
                        productName={productName}
                        handleVoteNow={handleVoteNow}
                        handlecloseVoteModal={handlecloseVoteModal}
                    />
                </ModalUI>
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <h4>Đánh giá sản phẩm:</h4>
                {ratings?.map((el, i) => (
                    <RatingComment
                        key={i}
                        avatar={el.postedBy.avatar}
                        star={el.star}
                        createdAt={el.commentAt}
                        comment={el.comment}
                        nameUser={`${el.postedBy.firstname} ${el.postedBy.lastname}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default withComponent(memo(RatingProductFunction));
