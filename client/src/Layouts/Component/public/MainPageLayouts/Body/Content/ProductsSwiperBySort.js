import { useEffect, useState } from 'react';
import { apiGetProducts } from 'Context/StoreApi/Products';
import { filterProducts } from 'Context/Reducer/Products/ProductsAction';
import { Link } from 'react-router-dom';
import withComponent from 'Hocs/withComponent';
import CustomSwiper from 'Layouts/Component/public/Common/CustomSwiper';
import path from 'Router/path';
import SliderLoading from './SliderLoading';

const ProductsSwiperBySort = ({ swiper, dispatch }) => {
    const [products, setProducts] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProducts = async () => {
        setIsLoading(true);
        const response = await apiGetProducts(swiper.apiData);
        setIsLoading(false);
        setProducts(response.products);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleClickTitle = () => {
        dispatch(filterProducts({ filterProductValue: swiper.redirectData }));
    };

    return (
        <section className="mt-10">
            <section>
                <div className="relative desktop:w-main laptop:w-full max-laptop:px-4">
                    <div className="flex justify-start items-center border-b-[3px] border-primary mb-12 w-full mx-auto">
                        <Link
                            to={`/${path.TOTAL_PRODUCTS}`}
                            onClick={handleClickTitle}
                            className="flex gap-2 items-center px-2 py-1 rounded-tl-lg rounded-tr-lg hover:bg-gray-100 cursor-pointer animation-200"
                        >
                            <img src={swiper.imagesTitle} alt="" className="h-8 w-8 object-cover"></img>
                            <h4 className="text-primary text-base font-semibold font-roboto uppercase">
                                {swiper.title}
                            </h4>
                        </Link>
                    </div>
                </div>
                {isLoading ? (
                    <SliderLoading />
                ) : (
                    <div className="relative desktop:w-main laptop:w-full max-laptop:px-4 products">
                        <CustomSwiper
                            spaceBetween={20}
                            navigation={true}
                            slidesPerView={5}
                            slidesPerViewLg={4}
                            slidesPerViewMd={3}
                            slidesPerViewSm={2}
                            loop={true}
                            arrayData={products}
                        />
                    </div>
                )}
            </section>
        </section>
    );
};

export default withComponent(ProductsSwiperBySort);
