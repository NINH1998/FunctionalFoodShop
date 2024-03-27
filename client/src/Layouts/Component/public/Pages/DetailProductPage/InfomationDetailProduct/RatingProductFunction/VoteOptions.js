import { useState, memo, forwardRef } from 'react';
import { Button, CloseModalButton } from 'Layouts/Component/public/Common';
import { ratingStar } from 'Ultils/Contants';
import { Icons } from 'Layouts/Assets/icons';

const { AiFillStar } = Icons;
const VoteOptions = forwardRef(({ productName, handleVoteNow, handlecloseVoteModal }, ref) => {
    const [score, setScore] = useState();
    const [comment, setComment] = useState();
    return (
        <div
            ref={ref}
            className="bg-white font-arima text-base laptop:min-w-[600px] phone:w-[calc(100%-8px)] mx-auto min-h-[400px] rounded-lg p-4"
        >
            <CloseModalButton onClose={handlecloseVoteModal} />
            <p className="font-semibold text-gray-600 text-center">Đánh giá sản phẩm:</p>
            <h3 className="text-center mb-2">{productName}</h3>
            <textarea
                placeholder="Nhận xét sản phẩm..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border-[#6b7280] border-[1px] p-2 w-full focus:outline-pink-600 placeholder:text-sm text-black !h-[100px] "
            ></textarea>
            <p className="text-black my-4">Bạn có thích sản phẩm này không?</p>
            <div className="flex justify-center items-end gap-4">
                {ratingStar.map((el) => (
                    <div
                        onClick={() => setScore(el.id)}
                        key={el.id}
                        className="flex flex-col justify-center items-center bg-gray-100 hover:bg-gray-200 animation rounded-xl w-[90px] h-[90px] cursor-pointer"
                    >
                        <span className="text-gray-500 text-center mb-2 text-sm whitespace-nowrap p-1">
                            {el.content}
                        </span>
                        {score >= el.id ? <AiFillStar color="orange" /> : <AiFillStar color="gray" />}
                    </div>
                ))}
            </div>
            <Button fw handleOnclick={() => handleVoteNow({ comment, score })}>
                Gửi nhận xét
            </Button>
        </div>
    );
});

export default memo(VoteOptions);
