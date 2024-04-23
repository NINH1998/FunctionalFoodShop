import { memo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { directCategory } from 'Context/Reducer/Products/ProductsAction';
import { navPhoneMenu } from 'Ultils/Contants';
import { Icons } from 'Layouts/Assets/icons';
import { Link } from 'react-router-dom';
import DropdownCategory from './DropdownCategory';
import path from 'Router/path';
import withComponent from 'Hocs/withComponent';

const { FaChevronRight } = Icons;

const NavPhoneMenu = ({ openNavBarMenu, isDropdownMenu, setIsDropdownMenu, setIsCancelMouseLeave, dispatch }) => {
    const menuTitleRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                menuTitleRef.current &&
                !menuRef.current.contains(e.target) &&
                !menuTitleRef.current.contains(e.target)
            ) {
                setIsDropdownMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handlResetFilterProducts = () => {
        dispatch(directCategory({ valueMainCategory: null }));
    };

    return (
        <AnimatePresence>
            {openNavBarMenu && (
                <motion.div
                    className="h-[120px] bg-white tablet:hidden shadow-default"
                    initial={{ height: '0px', opacity: 0 }}
                    animate={{ height: '120px', opacity: 1 }}
                    exit={{ height: '0px', opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'linear' }}
                >
                    <div className="w-full h-full">
                        {navPhoneMenu.map((el) => (
                            <div
                                key={el.id}
                                className="flex h-1/2 border-b-2 font-bold items-center hover:bg-gray-100 animation-200"
                            >
                                {el.icon ? (
                                    <div className="h-full w-full overflow-hidden cursor-pointer">
                                        <div
                                            className="text-base flex items-center py-4 px-6"
                                            ref={menuTitleRef}
                                            onClick={() => setIsDropdownMenu(!isDropdownMenu)}
                                        >
                                            <span className="whitespace-nowrap mr-2">{el.value}</span>
                                            <span>{el.icon}</span>
                                        </div>
                                        <AnimatePresence>
                                            {isDropdownMenu && (
                                                <motion.div
                                                    ref={menuRef}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.2, ease: 'easeOut' }}
                                                    className="absolute left-2 top-[110px] z-[999] bg-white p-2 shadow-large rounded-sm text-base"
                                                >
                                                    <div className="flex gap-1 h-full justify-end items-center hover:underline cursor-pointer">
                                                        <Link
                                                            to={`/${path.TOTAL_PRODUCTS}`}
                                                            onClick={handlResetFilterProducts}
                                                        >
                                                            Tất cả sản phẩm
                                                        </Link>
                                                        <FaChevronRight size={14} />
                                                    </div>
                                                    <DropdownCategory
                                                        setIsCancelMouseLeave={setIsCancelMouseLeave}
                                                        setIsDropdownMenu={setIsDropdownMenu}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link
                                        to={`/${path.CONTACT}`}
                                        className="flex items-center w-full h-full overflow-hidden cursor-pointer"
                                    >
                                        <div className="flex items-center h-full w-full py-4 px-6">
                                            <span className="whitespace-nowrap">{el.value}</span>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default withComponent(memo(NavPhoneMenu));
