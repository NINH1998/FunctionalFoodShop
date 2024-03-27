import withComponent from 'Hocs/withComponent';
import CustomSwiper from 'Layouts/Component/public/Common/CustomSwiper';
import React, { memo, useState } from 'react';
import PreviewImg from './PreviewProduct/PreviewImg';
import { IconsButton } from 'Layouts/Component/public/Common';
import { Images } from 'Layouts/Assets/icons';
import { showModal } from 'Context/Reducer/AppState/CommonAction';

const SliderDetailProduct = ({ product, useSelector, dispatch }) => {
    const { isShowModal } = useSelector((state) => state.appReducer);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const handleShowPreviewImg = () => {
        dispatch(showModal({ isShowModal: true }));
    };

    return (
        <div className="relative tablet:w-[45%] phone:w-full">
            <div className="relative main-swiper select-none">
                <CustomSwiper
                    slidesPerView={1}
                    navigation={true}
                    arrayData={product?.images}
                    loop={true}
                    styles={'iPadmini:min-h-[450px] phone:min-h-[350px] cursor-pointer rounded-md'}
                    thumbsSwiper={thumbsSwiper}
                    isThumb="main"
                ></CustomSwiper>
                <IconsButton
                    handleOnclick={handleShowPreviewImg}
                    styles="absolute bottom-0 right-0 bg-white shadow-small p-2 z-50 hover:bg-gray-100 animation-200 cursor-pointer rounded-sm"
                    icon={<img src={Images.Preview} alt="" className="w-6 h-6 object-fill"></img>}
                />
                <PreviewImg openPreview={isShowModal} product={product} />
            </div>
            <div className="sub-swiper select-none mt-4">
                <CustomSwiper
                    spaceBetween={20}
                    navigation={true}
                    slidesPerView={4}
                    phone={3}
                    loop={true}
                    arrayData={product?.images}
                    watchSlidesProgress={true}
                    onSwiper={setThumbsSwiper}
                    freeMode={true}
                    isThumb="sub"
                ></CustomSwiper>
            </div>
        </div>
    );
};

export default withComponent(memo(SliderDetailProduct));
