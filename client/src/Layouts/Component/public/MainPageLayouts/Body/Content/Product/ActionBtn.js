import { apiUpdateCart, apiUpdateWishlist } from 'Context/StoreApi';
import { motion, AnimatePresence } from 'framer-motion';
import { TippyWrap, ModalUI } from 'Layouts/Component/public/Common';
import { addToCartSession } from 'Context/Reducer/AppState/CommonAction';
import { getCurrentUser } from 'Context/Reducer/User/UserApi';
import { memo, useEffect, useState } from 'react';
import { Loading } from 'Layouts/Component/public/Common';
import { Icons } from 'Layouts/Assets/icons';
import { toast } from 'react-toastify';
import QuickViewModal from './QuickViewModal';
import withComponent from 'Hocs/withComponent';

const { FaEye, FaHeart, TiShoppingCart, FaRegHeart } = Icons;

const ActionBtn = ({ isOpen, product, setIsOpen, current, dispatch }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsOpen(false);
    };

    const handleAddCartUser = async (pid) => {
        if (current) {
            const quantity = current?.cart?.find((el) => el.product._id === pid)?.quantity;
            setIsLoading(true);
            const response = await apiUpdateCart({ pid, quantity: quantity + 1 || 1 });
            setIsLoading(false);
            if (response.success) {
                dispatch(getCurrentUser());
                toast.success(response.message);
            } else toast.error(response.message);
        } else {
            dispatch(
                addToCartSession({
                    product: {
                        thumb: product?.thumb,
                        title: product?.title,
                        id: product?._id,
                        price: product?.price,
                        uses: product?.uses,
                    },
                    quantity: 1,
                }),
            );
            toast.success('Đã thêm vào giỏ');
        }
    };

    const handleAddToWishlist = async (pid) => {
        const response = await apiUpdateWishlist(pid);
        if (response.success) {
            dispatch(getCurrentUser());
            toast.success(response.message);
        } else toast.error(response.message);
    };

    useEffect(() => {
        if (window.innerWidth <= 640) {
            setIsOpen(true);
        }
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <ModalUI isOpen={isModalOpen} onClose={handleCancel}>
                <QuickViewModal pid={product?._id} setIsModalOpen={setIsModalOpen} />
            </ModalUI>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: '50%' }}
                        animate={{ opacity: 100, y: '0%' }}
                        exit={{ opacity: 0, y: '50%' }}
                        transition={{ duration: 0.2, ease: 'linear' }}
                        className="flex justify-center laptop:block w-full absolute bottom-[-5%] text-center z-50"
                    >
                        <div className="flex justify-center items-center gap-3">
                            <TippyWrap content="Xem nhanh" fontSize="text-[12px]">
                                <div
                                    onClick={showModal}
                                    className="flex justify-center items-center bg-gray-50 hover:bg-gray-200
                                    animation w-[40px] h-[40px] rounded-[50%] shadow-default cursor-pointer"
                                >
                                    <FaEye color="#6b7280" size="16px" />
                                </div>
                            </TippyWrap>
                            <TippyWrap content="Thêm vào giỏ" fontSize="text-[12px]">
                                <div
                                    onClick={() => handleAddCartUser(product?._id)}
                                    className="flex justify-center items-center bg-gray-50 hover:bg-gray-200
                                    animation w-[40px] h-[40px] rounded-[50%] shadow-default cursor-pointer"
                                >
                                    {isLoading ? (
                                        <Loading color="#4d7c0f" size={16} border="!border-[3px]" />
                                    ) : (
                                        <TiShoppingCart color="#6b7280" size="16px" />
                                    )}
                                </div>
                            </TippyWrap>
                            <TippyWrap
                                content={
                                    current?.wishlist?.some((el) => el.product?._id === product?._id)
                                        ? 'Bỏ thích'
                                        : 'Thêm vào yêu thích'
                                }
                                fontSize="text-[12px]"
                            >
                                <div
                                    onClick={() => handleAddToWishlist(product?._id)}
                                    className="flex justify-center items-center bg-gray-50 hover:bg-gray-200
                                    animation w-[40px] h-[40px] rounded-[50%] shadow-default cursor-pointer"
                                >
                                    {current?.wishlist?.some((el) => el.product?._id === product?._id) ? (
                                        <FaHeart color="#f43f5e" size="16px" />
                                    ) : (
                                        <FaRegHeart color="#6b7280" size="16px" />
                                    )}
                                </div>
                            </TippyWrap>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default withComponent(memo(ActionBtn));
