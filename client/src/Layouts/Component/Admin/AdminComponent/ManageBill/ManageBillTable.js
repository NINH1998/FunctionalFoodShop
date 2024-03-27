import { IconsButton } from 'Layouts/Component/public/Common';
import { formatPrice } from 'Ultils/helper';
import { FaCheck } from 'react-icons/fa';
import { memo } from 'react';
import moment from 'moment';

const ManageBillTable = ({ bills, handleCompletedBill }) => {
    return (
        <table className="relative border-2 border-primary w-full">
            <thead className="bg-primary text-white">
                <tr className="whitespace-nowrap">
                    <th className="p-2">#</th>
                    <th className="p-2">Sản phẩm</th>
                    <th className="p-2">Tổng tiền</th>
                    <th className="p-2">Trạng thái</th>
                    <th className="p-2">Người đặt hàng</th>
                    <th className="p-2">Địa chỉ</th>
                    <th className="p-2">Phương thức thanh toán</th>
                    <th className="p-2">Ngày đặt hàng</th>
                    <th className="p-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {bills?.map((el, index) => (
                    <tr key={el._id} className="border-b-2 border-pink-300 text-sm ">
                        <th className="p-4 font-normal break-words">{index + 1}</th>
                        <th className="p-4 font-normal break-words">
                            {el.products.map((p, i) => (
                                <div key={i} className="flex gap-4 border-b-2 p-2">
                                    <img src={p.product?.thumb} alt="" className="object-cover w-10 h-10" />
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-start break-words">{p.product?.title}</span>
                                        <span className="text-start">{`Số lượng: ${p.quantity}`}</span>
                                    </div>
                                </div>
                            ))}
                        </th>
                        <th className="p-4 font-normal break-words text-red-500">
                            {` ${formatPrice(
                                el.products.reduce((num, p) => num + p.product?.price * p.quantity, 0),
                            )} VNĐ`}
                        </th>
                        <th
                            className={`p-4 font-normal whitespace-nowrap ${
                                el.status === 'processing'
                                    ? 'text-orange-400'
                                    : el.status === 'successed'
                                    ? 'text-green-500'
                                    : 'text-red-500'
                            }`}
                        >
                            {el.status === 'processing'
                                ? 'Đang chờ'
                                : el.status === 'successed'
                                ? 'Hoàn thành'
                                : 'Đã hủy'}
                        </th>
                        <th className="p-4 font-normal break-words">
                            {`${el.orderBy?.firstname} ${el.orderBy?.lastname}` || el.name}
                        </th>
                        <th className="p-4 font-normal break-words">
                            <p>{el.address || `${el.orderBy?.address}`}</p>
                            <p>{`Người nhận: ${el.receiver?.subName}`}</p>
                            <p>{`SĐT: ${el.receiver?.subPhone}`}</p>
                        </th>
                        <th className="p-4 font-normal break-words">{el.payments}</th>
                        <th className="p-4 font-normal break-words">{moment(el.createdAt).format('DD/MM/YYYY')}</th>
                        <th className="p-4 font-normal break-words">
                            <IconsButton
                                handleOnclick={() => handleCompletedBill(el._id)}
                                styles="flex justify-center text-red-400 font-semibold hover:underline cursor-pointer hover:scale-125 animation-200"
                                icon={<FaCheck size={'24px'} color="#4ade80" />}
                            />
                        </th>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default memo(ManageBillTable);
