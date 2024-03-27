import { starNumber } from 'Ultils/helper';
import { Images } from 'Layouts/Assets/icons';
import { memo } from 'react';
import moment from 'moment';

const Comment = ({ avatar, comment, nameUser = 'Ẩn danh', createdAt, star }) => {
    return (
        <div className="flex gap-2">
            <img className="w-[60px] h-[60px] object-fill rounded-full" src={avatar || Images.AvatarDefault} alt=""></img>
            <div className="flex flex-col gap-1 items-start text-sm">
                <div className="flex items-center">
                    <h4 className="whitespace-nowrap">{nameUser}</h4>
                    <span className="ml-2">{moment(createdAt).fromNow()}</span>
                </div>
                <div className="flex items-center">
                    <span>Đánh giá:</span>
                    <span className="flex ml-2">{starNumber(star)}</span>
                </div>
                <p className="py-1 px-4 break-all bg-gray-100 rounded-lg">{comment}</p>
            </div>
        </div>
    );
};

export default memo(Comment);
