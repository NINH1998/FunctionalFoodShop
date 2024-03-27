import { memo, useState } from 'react';
import { showModal } from 'Context/Reducer/AppState/CommonAction';
import { ModalUI } from 'Layouts/Component/public/Common';
import withComponent from 'Hocs/withComponent';
import PreviewSwiper from './PreviewSwiper';

const PreviewImg = ({ product, openPreview, dispatch }) => {
    const [thumbsSwiper2, setThumbsSwiper2] = useState(null);

    const closeModal = () => {
        dispatch(showModal({ isShowModal: false }));
    };

    return (
        <ModalUI isOpen={openPreview} onClose={closeModal} isPreviewImg>
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="flex flex-col items-center w-full h-[calc(100vh-50px)]">
                    <div className="flex items-center main-swiper select-none max-laptop:w-[80%] w-full h-5/6">
                        <PreviewSwiper
                            navigation={true}
                            slidesPerView={1}
                            loop={true}
                            arrayData={product?.images}
                            styles={'max-w-[1000px] h-[550px] max-phone:h-[300px] object-fill'}
                            effect="fade"
                            thumbsSwiper={thumbsSwiper2}
                            isZoom={true}
                        ></PreviewSwiper>
                    </div>
                    <div className="w-full flex justify-center items-center h-1/6">
                        <div className="sub-swiper select-none desktop:max-w-[1200px] max-laptop:max-w-[80%] pt-4 mx-auto">
                            <PreviewSwiper
                                spaceBetween={10}
                                navigation={true}
                                slidesPerView={10}
                                slidesPerViewLg={4}
                                slidesPerViewMd={3}
                                slidesPerViewSm={2}
                                phone={2}
                                loop={true}
                                arrayData={product?.images}
                                watchSlidesProgress={true}
                                onSwiper={setThumbsSwiper2}
                                freeMode={true}
                            ></PreviewSwiper>
                        </div>
                    </div>
                </div>
            </div>
        </ModalUI>
    );
};

export default withComponent(memo(PreviewImg));
