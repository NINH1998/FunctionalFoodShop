import { productSwipersCategory } from 'Ultils/Contants';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ProductsSwiperByFieldName from './Content/ProductsSwiperByFieldName';
import ProductsSwiperBySort from './Content/ProductsSwiperBySort';
import SwiperWallpaper from './Content/SwiperWallpaper';

const MainPageContainer = () => {
    const { categories } = useSelector((state) => state.categoriesReducer);
    const location = useLocation();
    const mainRef = useRef();

    useEffect(() => {
        mainRef.current.scrollIntoView(true);
    }, [location.pathname]);

    return (
        <main ref={mainRef}>
            <div className="h-[55px] w-full"></div>
            <SwiperWallpaper />
            <div className="relative w-full h-full">
                <div className="h-full desktop:w-main mx-auto">
                    {productSwipersCategory.map((swiper) => (
                        <ProductsSwiperBySort key={swiper.id} swiper={swiper} />
                    ))}
                    {categories?.map((item) => (
                        <ProductsSwiperByFieldName key={item._id} category={item} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default MainPageContainer;
