import { useEffect, useRef, useState } from 'react';
import { showLoginModal } from 'Context/Reducer/AppState/CommonAction';
import { Link, Outlet } from 'react-router-dom';
import { IconsButton } from '../public/Common';
import { Icons } from 'Layouts/Assets/icons';
import MemberSiderbar from './MemberSiderbar/Siderbar';
import withComponent from 'Hocs/withComponent';
import PhoneSiderbar from './MemberSiderbar/PhoneSiderbar';
import path from 'Router/path';

const { IoHomeSharp, TiThMenu } = Icons;

const MemberLayouts = ({ navigate, dispatch }) => {
    const [showNavBarMenu, setShowNavBarMenu] = useState(false);
    const navBarRef = useRef(null);
    const menuRef = useRef(null);

    let currentToken = localStorage.getItem('user');
    currentToken = JSON.parse(currentToken);

    let currentGoogleToken = localStorage.getItem('gmuser');
    currentGoogleToken = JSON.parse(currentGoogleToken);

    useEffect(() => {
        if (!currentToken && !currentGoogleToken) {
            dispatch(showLoginModal({ isOpenLoginModal: true }));
            navigate(`/${path.HOMEPAGE}`);
        }
    }, [currentToken, currentGoogleToken]);

    useEffect(() => {
        const handleClickOutSide = (e) => {
            if (navBarRef.current && !navBarRef.current.contains(e.target) && !menuRef.current.contains(e.target)) {
                setShowNavBarMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutSide);
        return () => document.removeEventListener('click', handleClickOutSide);
    }, []);

    return (
        <div className="flex relative w-full min-h-screen">
            <div className="laptop:w-[20%] h-full">
                <PhoneSiderbar ref={navBarRef} showNavBarMenu={showNavBarMenu} />
                <div className="fixed z-[999] laptop:w-[20%] h-full hidden laptop:block">
                    <MemberSiderbar />
                </div>
            </div>
            <div className="laptop:w-[80%] phone:w-full">
                <div className="w-full z-10 fixed top-0">
                    <div className="flex items-center justify-end gap-2 bg-gray-200 px-3 py-2 h-[35px] w-full laptop:hidden shadow-small">
                        <Link to={`/${path.HOMEPAGE}`} className="hover:text-primary">
                            <IoHomeSharp size={24} color="#374151" />
                        </Link>
                        <IconsButton
                            styles="hover:text-primary"
                            refprop={menuRef}
                            handleOnclick={() => setShowNavBarMenu(!showNavBarMenu)}
                            icon={<TiThMenu size={24} color="#374151" />}
                        />
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default withComponent(MemberLayouts);
