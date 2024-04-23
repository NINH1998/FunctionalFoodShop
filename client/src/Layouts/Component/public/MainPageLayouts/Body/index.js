import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getTag } from 'Context/Reducer/TagProduct/tagProductApi';
import ProductsSwiperByTag from './Content/ProductsSwiperByTag';
import SwiperWallpaper from './Content/SwiperWallpaper';
import withComponent from 'Hocs/withComponent';

const MainPageContainer = ({ dispatch, location }) => {
    const { tags } = useSelector((state) => state.tagReducer);
    const mainRef = useRef();

    useEffect(() => {
        dispatch(getTag());
    }, []);

    useEffect(() => {
        mainRef.current.scrollIntoView(true);
    }, [location.pathname]);

    return (
        <main ref={mainRef}>
            <div className="h-[55px] w-full"></div>
            <SwiperWallpaper />
            <div className="relative w-full h-full">
                <div className="h-full desktop:w-main mx-auto">
                    {tags?.map((tag) => (
                        <ProductsSwiperByTag key={tag._id} tag={tag} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default withComponent(MainPageContainer);
