import { Navigation, Pagination, A11y, EffectFade, FreeMode, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { React } from 'react';
import { memo } from 'react';
import ZoomPanImage from './ZoomPanPinchImg';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import 'swiper/swiper-bundle.css';

const PreviewSwiper = ({
    styles,
    arrayData,
    slidesPerView,
    slidesPerViewLg,
    slidesPerViewMd,
    slidesPerViewSm,
    phone,
    effect,
    navigation,
    isZoom,
    spaceBetween,
    onSwiper,
    thumbsSwiper,
    freeMode,
    watchSlidesProgress,
}) => {
    return (
        <div className="relative w-full h-full overflow-hidden">
            <Swiper
                slidesPerView={slidesPerView}
                spaceBetween={spaceBetween}
                breakpoints={{
                    0: {
                        slidesPerView: phone || 1,
                    },
                    640: {
                        slidesPerView: slidesPerViewSm || slidesPerView,
                    },
                    768: {
                        slidesPerView: slidesPerViewMd || slidesPerView,
                    },
                    1024: {
                        slidesPerView: slidesPerViewLg || slidesPerView,
                    },
                    1280: {
                        slidesPerView: slidesPerView || slidesPerView,
                    },
                }}
                navigation={navigation}
                modules={[Navigation, Pagination, A11y, EffectFade, FreeMode, Thumbs]}
                effect={effect}
                freeMode={freeMode}
                watchSlidesProgress={watchSlidesProgress}
                onSwiper={onSwiper}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                allowTouchMove={isZoom ? false : true}
            >
                {arrayData?.map((el, index) => (
                    <div key={index}>
                        {isZoom ? (
                            <SwiperSlide key={index}>
                                <ZoomPanImage>
                                    <img
                                        src={el}
                                        alt=""
                                        className={styles ? styles : 'object-cover w-full h-full'}
                                    ></img>
                                </ZoomPanImage>
                            </SwiperSlide>
                        ) : (
                            <SwiperSlide key={index} className="!min-w-[150px]">
                                (
                                <div className="sub-swiper-iteam border-2 border-white rounded-md cursor-pointer hover:border-white opacity-60 hover:opacity-100 animation-200">
                                    <img
                                        src={el}
                                        alt=""
                                        className={styles ? styles : 'object-cover w-full h-[80px]'}
                                    ></img>
                                </div>
                                );
                            </SwiperSlide>
                        )}
                    </div>
                ))}
            </Swiper>
        </div>
    );
};

export default memo(PreviewSwiper);
