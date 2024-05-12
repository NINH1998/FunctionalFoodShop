import { Icons } from 'Layouts/Assets/icons';
import { IconsButton } from 'Layouts/Component/public/Common';
import moment from 'moment';
import { memo } from 'react';

const { MdDelete, MdEdit, AiFillStar } = Icons;

const ProductsTable = ({ products, currentPage, handleEdit, handleDeleteProduct }) => {
    return (
        <table className="relative border-2 border-primary w-full">
            <thead className="bg-primary text-white">
                <tr className="whitespace-nowrap">
                    <th className="p-2">#</th>
                    <th className="p-2">Ảnh</th>
                    <th className="p-2">Tên sản phẩm</th>
                    <th className="p-2">Nhãn hàng</th>
                    <th className="p-2">Loại</th>
                    <th className="p-2">Giá</th>
                    <th className="p-2">Số Lượng</th>
                    <th className="p-2">Đã bán</th>
                    <th className="p-2">Đánh giá</th>
                    <th className="p-2">Ngày tạo</th>
                    <th className="p-2">Chỉnh sửa</th>
                </tr>
            </thead>
            <tbody>
                {products?.map((el, index) => (
                    <tr key={el._id} className="border-b-2 border-pink-300 text-sm ">
                        <th className="p-4 font-normal break-words">
                            {(currentPage > 1 && currentPage - 1) * +process.env.REACT_APP_PRODUCT_MANAGE + index + 1}
                        </th>
                        <th className="p-4">
                            <img src={el.thumb} alt="" className="object-cover min-w-[70px] h-[70px]" />
                        </th>
                        <th className="p-4 break-words font-semibold">{el.title}</th>
                        <th className="p-4 font-normal break-words">{el.brand}</th>
                        <th className="p-4 font-normal whitespace-nowrap">{el.category}</th>
                        <th className="p-4 font-normal break-words">{el.price}</th>
                        <th className="p-4 font-normal break-words">{el.quantity}</th>
                        <th className="p-4 font-normal break-words">{el.sold}</th>
                        <th className="p-4 font-normal break-words">
                            <div className="flex items-center justify-center gap-2">
                                {el.totalRatings} <AiFillStar color="orange" />
                            </div>
                        </th>
                        <th className="p-4 font-normal">{moment(el.createdAt).format('DD/MM/YYYY')}</th>
                        <th className="p-4">
                            <div className="flex justify-center items-center gap-2">
                                <IconsButton
                                    handleOnclick={() => handleEdit(el)}
                                    styles="hover:scale-110 cursor-pointer"
                                    icon={<MdEdit color="#ca8a04" size="28px" />}
                                />
                                <IconsButton
                                    handleOnclick={() => handleDeleteProduct(el._id)}
                                    styles="hover:scale-110 cursor-pointer"
                                    icon={<MdDelete color="#db2777" size="28px" />}
                                />
                            </div>
                        </th>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default memo(ProductsTable);
