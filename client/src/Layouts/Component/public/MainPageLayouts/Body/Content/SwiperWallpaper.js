import { Images } from 'Layouts/Assets/icons';
import CustomSwiper from 'Layouts/Component/public/Common/CustomSwiper';

const images = [Images.ThumbSliderWallpaper, Images.ThumbSliderWallpaper2];
const SwiperWallpaper = () => {
    return (
        <div className="header-swiper relative w-full">
            <CustomSwiper
                styles={'w-full h-[400px] object-cover'}
                navigation={true}
                slidesPerView={1}
                effect={'fade'}
                loop={true}
                arrayData={images}
                isThumb="main"
                autoplay
            ></CustomSwiper>
        </div>
    );
};

export default SwiperWallpaper;
