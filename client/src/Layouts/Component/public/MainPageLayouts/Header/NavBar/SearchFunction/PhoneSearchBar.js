import { forwardRef, memo } from 'react';
import { Loading } from 'Layouts/Component/public/Common';
import { motion } from 'framer-motion';
import HeadlessTippy from '@tippyjs/react/headless';
import SearchItem from './SearchItem';

const PhoneSearchBar = forwardRef(
    ({ isSearch, searchValue, isSearchLoading, setIsSearch, setSearchValue, handleSearchIconClick, products }, ref) => {
        return (
            <div className="phone:block iPadmini:hidden">
                <HeadlessTippy
                    interactive
                    visible={isSearch && searchValue && searchValue.q.length > 0 && searchValue.q !== ' ' && true}
                    placement="bottom"
                    offset={{ top: -10 }}
                    render={(attrs) => (
                        <div
                            tabIndex="-1"
                            className="iPadmini:hidden bg-white w-[calc(100vw-12px)] shadow-large"
                            {...attrs}
                        >
                            {isSearchLoading ? (
                                <div className="flex justify-center items-center p-2">
                                    <Loading color={'red'} size={'24px'} />
                                </div>
                            ) : (
                                products?.map((el) => (
                                    <SearchItem
                                        el={el}
                                        key={el._id}
                                        setIsSearch={setIsSearch}
                                        setSearchValue={setSearchValue}
                                    />
                                ))
                            )}
                            <div
                                onClick={handleSearchIconClick}
                                className="relative text-black font-semibold text-sm text-center cursor-pointer p-2 hover:bg-gray-200 
                            before:w-[95%] before:top-0 before:left-1/2 before:translate-x-[-50%] before:absolute before:content-[''] before:border-[1px] before:mx-auto"
                            >
                                Xem kết quả
                            </div>
                        </div>
                    )}
                >
                    <motion.input
                        ref={ref}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="absolute p-3 bottom-[-43px] right-0 w-full shadow-small 
                      bg-white ml-2 outline-none text-sm text-black flex-1 bg-transparent"
                        onChange={(e) => setSearchValue({ q: e.target.value })}
                        value={searchValue.q}
                    ></motion.input>
                </HeadlessTippy>
            </div>
        );
    },
);

export default memo(PhoneSearchBar);
