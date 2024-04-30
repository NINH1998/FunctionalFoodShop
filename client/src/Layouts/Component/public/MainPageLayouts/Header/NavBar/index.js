import { showCartButtonModal, showLoginModal } from 'Context/Reducer/AppState/CommonAction';
import { IconsButton, LoginModal, ModalUI } from 'Layouts/Component/public/Common';
import { useEffect, useState, useRef } from 'react';
import { directCategory } from 'Context/Reducer/Products/ProductsAction';
import { apiGetProducts } from 'Context/StoreApi';
import { Icons, Images } from 'Layouts/Assets/icons';
import { googleLogin } from 'Context/Reducer/LoginGooole/ApiLoginGoogle';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DropdownPhoneCategory from './NavigationMenu/DropdownPhoneCategory';
import ShoppingCartIcon from './ShoppingCartIcon';
import UserProfileMenu from './UserProfileMenu';
import NavigationMenu from './NavigationMenu';
import withComponent from 'Hocs/withComponent';
import useDebounce from 'Hooks/useDebounce';
import CartModal from './ShoppingCartIcon/CartModal';
import SearchBar from './SearchFunction/SearchBar';
import path from 'Router/path';
import Swal from 'sweetalert2';

const { TiThMenu } = Icons;

const NavBar = ({ dispatch, location, navigate }) => {
    const { mes } = useSelector((state) => state.userReducer);
    const [openCartModal, setOpenCartModal] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [searchValue, setSearchValue] = useState({ q: '' });
    const [products, setProducts] = useState([]);
    const [isSearchLoading, setIsSearcLoading] = useState([]);
    const [isDropdownMenu, setIsDropdownMenu] = useState(false);
    const [openNavBarMenu, setOpenNavBarMenu] = useState(false);
    const [isCancelMouseLeave, setIsCancelMouseLeave] = useState(false);
    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const navPhoneRef = useRef(null);
    const btnMenuPhoneRef = useRef(null);

    useEffect(() => {
        dispatch(showCartButtonModal({ isCartButtonModal: true }));
        // eslint-disable-next-line
    }, [location.pathname]);

    useEffect(() => {
        setOpenNavBarMenu(false);
    }, [location.pathname]);

    const handleSearchIconClick = () => {
        const containsValue = /[a-zA-Z]/.test(searchValue.q);
        setIsSearch(!isSearch);
        if (containsValue) {
            dispatch(directCategory({ searchValue: searchValue }));
            navigate(`/${path.TOTAL_PRODUCTS}`);
            setSearchValue({ q: '' });
        }
    };

    const searchProductsApi = async () => {
        setIsSearcLoading(true);
        const response = await apiGetProducts({ q: searchValue.q.trim(), limit: 10 });
        setIsSearcLoading(false);
        setProducts(response.products);
    };

    const debounceSearch = useDebounce(searchValue.q, 300);
    useEffect(() => {
        if (debounceSearch) searchProductsApi();
        // eslint-disable-next-line
    }, [debounceSearch]);

    useEffect(() => {
        if (mes)
            Swal.fire('', mes, 'info').then(() => {
                dispatch(showLoginModal({ isOpenLoginModal: true }));
            });
        // eslint-disable-next-line
    }, [mes]);

    useEffect(() => {
        dispatch(googleLogin());
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchValue({ q: '' });
                setIsSearch(false);
                setProducts([]);
            }
            if (
                navPhoneRef.current &&
                !isDropdownMenu &&
                !searchRef.current.contains(e.target) &&
                !navPhoneRef.current.contains(e.target) &&
                !btnMenuPhoneRef.current.contains(e.target)
            ) {
                setOpenNavBarMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isDropdownMenu]);

    useEffect(() => {
        if (isSearch) {
            inputRef.current.focus();
        }
        // eslint-disable-next-line
    }, [isSearch]);

    return (
        <div className="relative w-full">
            <div className="fixed top-0 z-[988] w-screen shadow-small bg-white">
                <div className="h-[55px] desktop:w-main mx-auto">
                    <nav className="flex w-full h-full">
                        <div className="flex w-full justify-between items-center text-gray-700 px-4">
                            <div className="flex items-center relative ml-4">
                                <img
                                    src={Images.ShopLogo}
                                    alt="Avatar_User"
                                    className="object-cover w-10 h-10 absolute left-[-19%] opacity-50"
                                ></img>
                                <Link
                                    className="font-bold text-primary text-3xl max-phone:text-2xl z-10 outline-none"
                                    to={`/${path.HOMEPAGE}`}
                                >
                                    KimLien
                                </Link>
                            </div>
                            <div className="flex items-center text-base h-full phone:gap-2 iPadmini:gap-8">
                                <NavigationMenu
                                    setIsDropdownMenu={setIsDropdownMenu}
                                    isDropdownMenu={isDropdownMenu}
                                    setIsCancelMouseLeave={setIsCancelMouseLeave}
                                    isCancelMouseLeave={isCancelMouseLeave}
                                />
                                <ShoppingCartIcon setOpenCartModal={setOpenCartModal} />
                                <ModalUI isOpen={openCartModal} onClose={() => setOpenCartModal(false)}>
                                    <CartModal setOpenModal={setOpenCartModal} />
                                </ModalUI>
                                <div ref={searchRef}>
                                    <SearchBar
                                        ref={inputRef}
                                        isSearch={isSearch}
                                        setIsSearch={setIsSearch}
                                        searchValue={searchValue}
                                        setSearchValue={setSearchValue}
                                        isSearchLoading={isSearchLoading}
                                        handleSearchIconClick={handleSearchIconClick}
                                        products={products}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div ref={btnMenuPhoneRef}>
                                    <IconsButton
                                        styles="p-1 bg-primary rounded-md cursor-pointer tablet:hidden"
                                        handleOnclick={() => setOpenNavBarMenu(!openNavBarMenu)}
                                        icon={<TiThMenu size={24} color="white" />}
                                    />
                                </div>
                                <UserProfileMenu />
                                <LoginModal />
                            </div>
                        </div>
                    </nav>
                </div>
                <div ref={navPhoneRef}>
                    <DropdownPhoneCategory
                        openNavBarMenu={openNavBarMenu}
                        isCancelMouseLeave={isCancelMouseLeave}
                        setIsCancelMouseLeave={setIsCancelMouseLeave}
                        setIsDropdownMenu={setIsDropdownMenu}
                        isDropdownMenu={isDropdownMenu}
                    />
                </div>
            </div>
        </div>
    );
};

export default withComponent(NavBar);
