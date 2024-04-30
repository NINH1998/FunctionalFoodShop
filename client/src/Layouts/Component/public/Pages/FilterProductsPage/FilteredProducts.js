import { memo, useEffect, useLayoutEffect, useState } from 'react';
import { useSearchParams, createSearchParams } from 'react-router-dom';
import { getProducts } from 'Context/Reducer/Products/ProductsApi';
import { useSelector } from 'react-redux';
import { Icons } from 'Layouts/Assets/icons';
import { t } from 'i18next';
import FilterFunction from './FilterFunction';
import ReactPaginate from 'react-paginate';
import SliderLoading from '../../MainPageLayouts/Body/Content/SliderLoading';
import withComponent from 'Hocs/withComponent';
import IconsButton from '../../Common/IconsButton';
import Product from '../../MainPageLayouts/Body/Content/Product/ProductContainer';

const { FaChevronLeft, FaChevronRight } = Icons;

const FilteredProducts = ({ dispatch, navigate, location }) => {
    const { searchValue, products, isLoading, valueMainCategory, tagId, clearParams } = useSelector(
        (state) => state.productsReducer,
    );
    const [params] = useSearchParams();
    const { pathname } = location;
    const isProductPath = pathname.replace('/', '');
    const [currentPage, setCurrentPage] = useState(parseInt(Object.fromEntries([...params]).page) || 1);
    const [selected, setSeclected] = useState(Object.fromEntries([...params]).category?.split(',') || []);
    const [selectedMainField, setSelectedMainField] = useState(
        Object.fromEntries([...params]).mainCategory?.split(',') || [],
    );
    const [updated, setUpdated] = useState(false);
    const [sort, setSort] = useState('');
    const [discount, setDiscount] = useState('');
    const [openFilter, setOpenFilter] = useState(false);
    const [price, setPrice] = useState({
        From: '',
        To: '',
    });

    const fetchProducts = async (queries) => {
        dispatch(getProducts(queries));
    };

    const pageCount = Math.ceil((products?.counts || 1) / +process.env.REACT_APP_PRODUCT_PER_PAGE);
    const changePage = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        if (currentPage > 1) {
            queries.page = currentPage;
        } else delete queries.page;

        if (sort) {
            queries.sort = sort;
        }

        if (tagId) {
            queries.tagId = tagId;
        }

        if (valueMainCategory?.join(',')) {
            queries.mainCategory = valueMainCategory.join(',');
        } else delete queries.mainCategory;

        navigate(
            {
                pathname: location.pathname,
                search: createSearchParams({
                    ...queries,
                    ...searchValue,
                }).toString(),
            },
            { replace: true },
        );

        if (isProductPath && isProductPath !== 'san-pham') {
            queries.category = t(isProductPath);
        }

        fetchProducts({
            ...queries,
            ...searchValue,
        });
        // eslint-disable-next-line
    }, [clearParams, isProductPath, sort, currentPage, searchValue, valueMainCategory]);

    const handleFilter = () => {
        const queries = Object.fromEntries([...params]);

        if (selectedMainField.join(',')) {
            queries.mainCategory = selectedMainField.join(',');
        } else delete queries.mainCategory;

        if (selected.join(',')) {
            queries.category = selected.join(',');
        } else delete queries.category;

        if (price.From) {
            queries.From = +price.From;
        } else delete queries.From;

        if (price.To) {
            queries.To = +price.To;
        } else delete queries.To;

        navigate(
            {
                pathname: location.pathname,
                search: createSearchParams({
                    ...queries,
                }).toString(),
            },
            { replace: true },
        );

        delete queries.page;
        setCurrentPage(1);
        setOpenFilter(false);
        setUpdated(!updated);

        fetchProducts({
            ...queries,
            ...discount,
        });
    };

    useEffect(() => {
        if (clearParams) {
            setSort('');
            setCurrentPage(1);
            setSeclected([]);
            setSelectedMainField([]);
            setOpenFilter(false);
            setPrice({ From: '', To: '' });
        }
    }, [clearParams, sort]);

    useLayoutEffect(() => {
        if (t(isProductPath) !== 'Sản phẩm') setCurrentPage(1);
    }, [isProductPath]);

    return (
        <>
            <FilterFunction
                fetchProducts={fetchProducts}
                setCurrentPage={setCurrentPage}
                selected={selected}
                setSeclected={setSeclected}
                selectedMainField={selectedMainField}
                setSelectedMainField={setSelectedMainField}
                setPrice={setPrice}
                price={price}
                setDiscount={setDiscount}
                currentPage={currentPage}
                openFilter={openFilter}
                setOpenFilter={setOpenFilter}
                handleFilter={handleFilter}
                setSort={setSort}
                sort={sort}
            />
            <div className="relative desktop:w-main phone:w-full">
                <div className="relative desktop:w-main phone:w-full">
                    {isLoading ? (
                        <SliderLoading
                            numberItem={12}
                            styles="grid desktop:grid-cols-4 phone:grid-cols-1 iPadmini:grid-cols-2 tablet:grid-cols-3 gap-10"
                        />
                    ) : (
                        <div className="grid desktop:grid-cols-4 tablet:grid-cols-3 iPadmini:grid-cols-2 phone:grid-cols-1 auto-rows-auto gap-10 px-4">
                            {products?.products?.map((product) => (
                                <Product product={product} key={product._id} />
                            ))}
                        </div>
                    )}
                </div>
                <ReactPaginate
                    forcePage={(currentPage && currentPage - 1) || 0}
                    nextLabel={<IconsButton styles="paginate-btn" icon={<FaChevronRight color="white" size={18} />} />}
                    previousLabel={
                        <IconsButton styles="paginate-btn" icon={<FaChevronLeft color="white" size={18} />} />
                    }
                    onPageChange={changePage}
                    pageRangeDisplayed={4}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    pageClassName="ring-2 w-10 h-10 ring-gray-300 hover:bg-primary font-semibold text-lg hover:text-white rounded-full mx-2 cursor-pointer"
                    pageLinkClassName="flex items-center justify-center w-full h-full"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel={<span>...</span>}
                    breakClassName="flex items-center justify-center w-10 h-10 ring-2 ring-gray-300 hover:bg-primary font-semibold text-lg hover:text-white rounded-full cursor-pointer"
                    breakLinkClassName="flex items-center justify-center w-full h-full"
                    containerClassName="flex mt-8 phone:scale-90 laptop:scale-100 justify-center items-center"
                    activeClassName="bg-lime-600 text-white"
                />
            </div>
        </>
    );
};

export default withComponent(memo(FilteredProducts));
