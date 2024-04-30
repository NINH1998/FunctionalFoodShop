import { apiGetProduct, apiGetProducts } from 'Context/StoreApi/Products';
import { useEffect, useRef, useState } from 'react';
import { apiGetTagByProduct } from 'Context/StoreApi/Tag';
import { useTranslation } from 'react-i18next';
import { BreadCrumb } from '../index';
import { getProduct } from 'Context/Reducer/Products/ProductsAction';
import { useParams } from 'react-router-dom';
import { Images } from 'Layouts/Assets/icons';
import InfomationDetailProduct from './InfomationDetailProduct';
import ProductSpecifications from './ProductSpecifications';
import SliderDetailProduct from './SliderDetailProduct';
import CustomSwiper from 'Layouts/Component/public/Common/CustomSwiper';
import withComponent from 'Hocs/withComponent';

const DetailProductPage = ({ dispatch, location }) => {
    const { pid, category } = useParams();
    const [relativeProducts, setRelativeProducts] = useState(null);
    const [updateRating, setUpdateRating] = useState(1);
    const [tagProduct, setTagProduct] = useState([]);
    const [product, setProduct] = useState(null);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const breadcrumbRef = useRef(null);
    const { t } = useTranslation();

    const fetchProduct = async () => {
        setIsLoadingProduct(true);
        const response = await apiGetProduct(pid);
        setIsLoadingProduct(false);

        if (response.success) {
            setProduct(response?.product);
            dispatch(getProduct({ product: response.product }));
        }
    };

    const fetchProducts = async () => {
        const transCategory = t(category);
        const response = await apiGetProducts({ category: transCategory });
        if (response.success) {
            setRelativeProducts(response?.products);
        }
    };

    const getTagProduct = async () => {
        const rs = await apiGetTagByProduct(pid);
        if (rs.success) setTagProduct(rs.tag);
    };

    useEffect(() => {
        getTagProduct();
    }, [product]);

    useEffect(() => {
        if (pid) {
            fetchProduct();
            fetchProducts();
            getTagProduct();
        }
        // eslint-disable-next-line
    }, [pid, updateRating]);

    useEffect(() => {
        breadcrumbRef.current.scrollIntoView({ behavior: 'auto' });
    }, [location.pathname]);

    return (
        <div>
            <div className="w-full">
                <div className="w-full px-6 py-3 text-end bg-gray-200" ref={breadcrumbRef}>
                    <BreadCrumb pid={pid} isDetailPage />
                </div>
            </div>
            <div className="justify-center p-6 relative w-full">
                <div className="flex gap-10 tablet:flex-row phone:flex-col bg-white rounded-lg desktop:w-main phone:w-full m-auto h-full ">
                    <SliderDetailProduct product={product} isLoadingProduct={isLoadingProduct} />
                    <ProductSpecifications product={product} tagProduct={tagProduct} />
                </div>
                <div className="desktop:w-main m-auto tablet:p-4 phone:mt-6 tablet:mt-2">
                    <InfomationDetailProduct
                        totalRatings={product?.totalRatings}
                        ratings={product?.ratings}
                        productName={product?.title}
                        pid={product?._id}
                        setUpdateRating={setUpdateRating}
                        description={product?.description}
                        fetchProduct={fetchProduct}
                    />
                </div>
                <div className="relative desktop:w-main mx-auto mb-6">
                    <div className="p-4">
                        <div className="flex justify-start items-center border-b-[2px] border-primary mb-12 mx-auto">
                            <div className="flex gap-2 items-center bg-gray-200 px-4 py-1 rounded-tl-lg rounded-tr-lg">
                                <img src={Images.BestSeller} alt="" className="h-8 w-8 object-cover"></img>
                                <h4 className="text-primary text-base font-semibold font-roboto">Sản phẩm liên quan</h4>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center flex-wrap w-full">
                        <div className="desktop:w-main phone:w-full products">
                            <CustomSwiper
                                spaceBetween={20}
                                navigation={true}
                                slidesPerView={5}
                                slidesPerViewLg={4}
                                slidesPerViewMd={3}
                                slidesPerViewSm={2}
                                loop={true}
                                arrayData={relativeProducts}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withComponent(DetailProductPage);
