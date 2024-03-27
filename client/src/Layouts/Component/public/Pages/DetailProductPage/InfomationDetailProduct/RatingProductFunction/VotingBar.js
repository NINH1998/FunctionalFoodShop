import { memo, useEffect, useRef } from 'react';
import { AiFillStar } from 'react-icons/ai';

const VoteBar = ({ number, ratingCount, totalRating }) => {
    const percentRef = useRef();

    useEffect(() => {
        const percent = (ratingCount / totalRating) * 100 || 0;
        percentRef.current.style.width = `${percent}%`;
    }, [ratingCount, totalRating]);

    return (
        <div className="flex gap-4 items-center text-[16px] leading-[21px] ">
            <div className="flex flex-1 items-center justify-center font-semibold">
                <span className="h-4 w-[9px] text-end">{number}</span>
                <span className="ml-[2px]">
                    <AiFillStar color="orange" />
                </span>
            </div>
            <div className="flex-7">
                <div className="relative w-full h-[8px] bg-gray-300 rounded-xl">
                    <div ref={percentRef} className={`absolute inset-0 bg-primary rounded-xl`}></div>
                </div>
            </div>
            <div className="flex-2 text-sm font-semibold whitespace-nowrap">{ratingCount || 0} đánh giá</div>
        </div>
    );
};

export default memo(VoteBar);
