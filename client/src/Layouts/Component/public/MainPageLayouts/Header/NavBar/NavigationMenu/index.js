import { motion, AnimatePresence } from 'framer-motion';
import { filterProducts } from 'Context/Reducer/Products/ProductsAction';
import { Navigation } from 'Ultils/Contants';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import withComponent from 'Hocs/withComponent';
import DropdownMenu from './DropdownMenu';

const NavigationMenu = ({ dispatch, setIsDropdownMenu, isDropdownMenu, setIsCancelMouseLeave, isCancelMouseLeave }) => {
    const handlResetFilterProducts = () => {
        dispatch(filterProducts({ filterProductValue: null }));
    };

    return (
        <div className="laptop:flex tablet:flex iPadmini:hidden phone:hidden h-full">
            {Navigation.map((el) => (
                <div key={el.id} className="flex justify-center font-bold items-center hover:bg-gray-200 animation-200">
                    {el.icon ? (
                        <div
                            className="relative w-full h-full cursor-pointer"
                            onMouseEnter={() => setIsDropdownMenu(true)}
                            onMouseLeave={() => (isCancelMouseLeave ? false : setIsDropdownMenu(false))}
                        >
                            <Link
                                to={el.path}
                                className="h-full w-full flex items-center"
                                onClick={handlResetFilterProducts}
                            >
                                <div className="text-base flex items-center px-6">
                                    <span className="whitespace-nowrap mr-2">{el.value}</span>
                                    <span>{el.icon}</span>
                                </div>
                            </Link>
                            <AnimatePresence>
                                {isDropdownMenu && (
                                    <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 10, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                        className="absolute left-[-100%] top-[55px] z-[999] bg-white p-2 shadow-large rounded-md text-base"
                                    >
                                        <DropdownMenu
                                            setIsDropdownMenu={setIsDropdownMenu}
                                            setIsCancelMouseLeave={setIsCancelMouseLeave}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link to={el.path} className="h-full w-full flex items-center cursor-pointer">
                            <div className="flex items-center px-6">
                                <span className="whitespace-nowrap">{el.value}</span>
                            </div>
                        </Link>
                    )}
                </div>
            ))}
        </div>
    );
};

export default withComponent(memo(NavigationMenu));
