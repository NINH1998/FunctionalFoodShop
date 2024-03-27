import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Images } from 'Layouts/Assets/icons';
import NavBar from './NavBar';

const Header = () => {
    const location = useLocation();
    const pathname = location.pathname.split('/').filter((el) => el !== '');
    const { t } = useTranslation();

    return (
        <>
            <NavBar />
            {pathname.length > 0 && (
                <div className="relative w-full">
                    <img alt="" src={Images.WallPaperCart} className="object-cover w-full h-[400px]"></img>
                    <div className="absolute top-1/2 left-[10%] flex items-center uppercase p-4 text-white">
                        <h1 className="ml-4 pt-2">{t(pathname)}</h1>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
