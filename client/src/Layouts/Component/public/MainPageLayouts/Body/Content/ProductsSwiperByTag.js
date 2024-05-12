import { useEffect, useState } from 'react';
import { apiGetProducts } from 'Context/StoreApi/Products';
import { directCategory, filterProductsByTag } from 'Context/Reducer/Products/ProductsAction';
import { Link } from 'react-router-dom';
import ProductLoading from './ProductLoading';
import withComponent from 'Hocs/withComponent';
import CustomSwiper from 'Layouts/Component/public/Common/CustomSwiper';
import path from 'Router/path';

const ProductsSwiperBySort = ({ tag, dispatch }) => {
    const [products, setProducts] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProducts = async () => {
        setIsLoading(true);
        const response = await apiGetProducts({ tagId: tag._id, limit: 10 });
        if (response.success) {
            setIsLoading(false);
            setProducts(response.products);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleClickTitle = () => {
        dispatch(directCategory({ tagId: tag._id }));
    };

    return (
        <div className="mt-10">
            <div>
                {products?.length > 0 && (
                    <div className="relative desktop:w-main laptop:w-full max-laptop:px-4">
                        <div className="flex justify-start items-center border-b-[3px] border-primary mb-12 w-full mx-auto">
                            <Link
                                to={`/${path.TOTAL_PRODUCTS}`}
                                onClick={handleClickTitle}
                                className="flex gap-2 items-center px-2 py-1 rounded-tl-lg rounded-tr-lg hover:bg-gray-100 cursor-pointer animation-200"
                            >
                                <img src={tag.iconTag} alt="" className="h-8 w-8 object-cover"></img>
                                <h4 className="text-primary text-base font-semibold font-roboto uppercase">
                                    {tag.title}
                                </h4>
                            </Link>
                        </div>
                    </div>
                )}
                {isLoading ? (
                    <ProductLoading />
                ) : (
                    <div className="relative desktop:w-main laptop:w-full max-laptop:px-4 products">
                        <CustomSwiper
                            spaceBetween={20}
                            navigation={true}
                            slidesPerView={5}
                            slidesPerViewLg={4}
                            slidesPerViewMd={3}
                            slidesPerViewSm={2}
                            arrayData={products}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default withComponent(ProductsSwiperBySort);
