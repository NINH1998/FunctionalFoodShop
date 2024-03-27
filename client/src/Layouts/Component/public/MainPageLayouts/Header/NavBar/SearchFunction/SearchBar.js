import { motion, AnimatePresence } from 'framer-motion';
import { IconsButton, Loading } from 'Layouts/Component/public/Common';
import { forwardRef, memo } from 'react';
import { BeatLoader } from 'react-spinners';
import { Icons } from 'Layouts/Assets/icons';
import PhoneSearchBar from './PhoneSearchBar';
import HeadlessTippy from '@tippyjs/react/headless';
import SearchItem from './SearchItem';

const { IoSearch } = Icons;

const SearchBar = forwardRef(
    ({ setIsSearch, searchValue, isSearch, setSearchValue, isSearchLoading, handleSearchIconClick, products }, ref) => {
        return (
            <HeadlessTippy
                interactive
                visible={isSearch && searchValue && searchValue.q.length > 0 && searchValue.q !== ' ' && true}
                placement="bottom"
                offset={{ top: -10 }}
                render={(attrs) => (
                    <div tabIndex="-1" className="max-phone:hidden bg-white w-[235px] shadow-large" {...attrs}>
                        {isSearchLoading ? (
                            <div className="flex justify-center items-center p-2">
                                <Loading shape={<BeatLoader size={6} color="#65a30d" />} />
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
                            before:w-[95%] before:absolute before:top-0 before:left-1/2 before:translate-x-[-50%] before:content-[''] before:border-[1px]"
                        >
                            Xem kết quả
                        </div>
                    </div>
                )}
            >
                <div className="tablet:relative flex bg-gray-50 rounded-full p-1 border-2 border-gray-300 mr-2">
                    <IconsButton
                        handleOnclick={handleSearchIconClick}
                        styles="flex items-center justify-center hover:bg-gray-200 rounded-full p-1 cursor-pointer"
                        icon={<IoSearch size="20px" />}
                    />
                    <AnimatePresence>
                        {isSearch && (
                            <>
                                <div className="phone:hidden iPadmini:block">
                                    <motion.input
                                        ref={ref}
                                        initial={{ width: '0px' }}
                                        animate={{ width: 'auto' }}
                                        exit={{ width: '0px' }}
                                        transition={{ duration: 0.2, ease: 'linear' }}
                                        type="text"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        className="bg-white ml-2 outline-none text-sm text-black bg-transparent"
                                        onChange={(e) => setSearchValue({ q: e.target.value })}
                                        value={searchValue.q}
                                    ></motion.input>
                                </div>
                                <PhoneSearchBar
                                    ref={ref}
                                    isSearch={isSearch}
                                    products={products}
                                    searchValue={searchValue}
                                    setSearchValue={setSearchValue}
                                    isSearchLoading={isSearchLoading}
                                    setIsSearch={setIsSearch}
                                    handleSearchIconClick={handleSearchIconClick}
                                />
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </HeadlessTippy>
        );
    },
);

export default memo(SearchBar);
