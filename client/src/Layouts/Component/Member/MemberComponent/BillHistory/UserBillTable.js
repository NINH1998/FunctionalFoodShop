import { formatPrice } from 'Ultils/helper';
import moment from 'moment';
import React, { memo } from 'react';

const UserBillTable = ({ bills, handleCancelBill }) => {
    return (
        <table className="relative border-2 border-primary w-full">
            <thead className="bg-primary text-white">
                <tr className="whitespace-nowrap">
                    <th className="p-2">#</th>
                    <th className="p-2">Sản phẩm</th>
                    <th className="p-2">Tổng tiền</th>
                    <th className="p-2">Trạng thái</th>
                    <th className="p-2">Ngày đặt hàng</th>
                    <th className="p-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {bills?.map((el, index) => (
                    <tr key={el._id} className="border-b-2 border-pink-300 text-sm ">
                        <th className="p-4 font-normal break-words">{index + 1}</th>
                        <th className="p-4 font-normal break-words">
                            {el.products?.map((p, i) => (
                                <div key={i} className="flex gap-4 border-b-2 p-2">
                                    <img src={p.product.thumb} alt="" className="object-cover w-10 h-10" />
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-start">{p.product.title}</span>
                                        <span className="text-start">{`Số lượng: ${p.quantity}`}</span>
                                        <span className="text-start">{`Thành tiền: ${formatPrice(
                                            p.product.price * p.quantity,
                                        )} VNĐ`}</span>
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
                            className={`p-4 font-normal break-words ${
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
                        <th className="p-4 font-normal break-words">{moment(el.createdAt).format('DD/MM/YYYY')}</th>
                        <th className="p-4 font-normal break-words">
                            {el.status === 'cancelled' ? (
                                <span className="text-gray-400 font-semibold whitespace-nowrap">Hủy đơn hàng</span>
                            ) : Date.now() < new Date(el.createdAt).getTime() + 24 * 60 * 60 * 1000 ? (
                                <span
                                    onClick={() => handleCancelBill(el._id)}
                                    className="text-red-400 font-semibold hover:underline cursor-pointer whitespace-nowrap"
                                >
                                    Hủy đơn hàng
                                </span>
                            ) : (
                                <span className="text-gray-500 opacity-[0.7] font-semibold hover:underline cursor-pointer">
                                    Không thể hủy
                                </span>
                            )}
                        </th>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default memo(UserBillTable);
