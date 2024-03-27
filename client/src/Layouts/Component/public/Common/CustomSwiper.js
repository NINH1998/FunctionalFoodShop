import { Navigation, Pagination, A11y, EffectFade, FreeMode, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { React } from 'react';
import { memo } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import ProductContainer from '../MainPageLayouts/Body/Content/Product/ProductContainer';

const CustomSwiper = ({
    styles,
    arrayData,
    slidesPerView,
    slidesPerViewLg,
    slidesPerViewMd,
    slidesPerViewSm,
    phone,
    effect,
    navigation,
    loop,
    spaceBetween,
    onSwiper,
    thumbsSwiper,
    freeMode,
    watchSlidesProgress,
    isThumb,
}) => {
    return (
        <div className="relative">
            <Swiper
                slidesPerView={slidesPerView}
                spaceBetween={spaceBetween}
                navigation={navigation}
                modules={[Navigation, Pagination, A11y, EffectFade, FreeMode, Thumbs]}
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
                effect={effect}
                freeMode={freeMode}
                watchSlidesProgress={watchSlidesProgress}
                onSwiper={onSwiper}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            >
                {arrayData?.map((el, index) => (
                    <SwiperSlide key={index}>
                        {isThumb === 'sub' ? (
                            <div className="sub-swiper-iteam opacity-60 p-1 rounded-md">
                                <div
                                    style={{ background: `url(${el}) center center / cover no-repeat` }}
                                    className={styles ? styles : 'pb-[100%] cursor-pointer'}
                                ></div>
                            </div>
                        ) : isThumb === 'main' ? (
                            <div
                                style={{ background: `url(${el}) center center / cover no-repeat` }}
                                className={styles ? styles : 'pb-[100%] cursor-pointer'}
                            ></div>
                        ) : (
                            <ProductContainer product={el} key={el._id} />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default memo(CustomSwiper);
