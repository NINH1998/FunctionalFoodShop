import { Images } from 'Layouts/Assets/icons';
import { Link } from 'react-router-dom';
import path from 'Router/path';

const NotificationBillList = ({ bills }) => {
    return (
        <div className="overflow-auto max-h-[700px]">
            {bills?.map((bill) => (
                <Link
                    to={`/${path.ADMIN}/${path.MANAGE_BILL}`}
                    key={bill._id}
                    style={{ backgroundColor: !bill.viewed && '#e5e7eb' }}
                    className="flex gap-2 p-2 hover:bg-gray-200 hover:text-black cursor-pointer max-w-[350px] h-full"
                >
                    <img
                        alt=""
                        src={bill?.orderBy?.avatar || Images.AvatarDefault}
                        className="w-[80px] h-full object-cover"
                    />
                    <p className="line-clamp-4">
                        Khách hàng <b>{bill.buyer?.name}</b> đã đặt 1 đơn mới gồm <b>{bill?.products?.length}</b> sản
                        phẩm:{' '}
                        {bill?.products?.map((el) => (
                            <b key={el._id}>{el.product?.title},</b>
                        ))}
                    </p>
                </Link>
            ))}
        </div>
    );
};

export default NotificationBillList;
