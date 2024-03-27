import { useSearchParams, createSearchParams } from 'react-router-dom';
import { memo, useEffect, useState } from 'react';
import { getProducts } from 'Context/Reducer/Products/ProductsApi';
import { useSelector } from 'react-redux';
import { Loading } from '../../Common';
import { Icons } from 'Layouts/Assets/icons';
import { t } from 'i18next';
import ReactPaginate from 'react-paginate';
import withComponent from 'Hocs/withComponent';
import FilterFunction from './FilterFunction';
import IconsButton from '../../Common/IconsButton';
import Product from '../../MainPageLayouts/Body/Content/Product/ProductContainer';

const { FaChevronLeft, FaChevronRight } = Icons;

const FilteredProducts = ({ dispatch, navigate, location }) => {
    const { searchValue, products, isLoading, valueCategory, filterProductValue } = useSelector(
        (state) => state.productsReducer,
    );
    const [params] = useSearchParams();
    const { pathname } = location;
    const isProductPath = pathname.replace('/', '');
    const [currentPage, setCurrentPage] = useState(0);
    const [selected, setSeclected] = useState([]);
    const [selectedMainField, setSelectedMainField] = useState([]);
    const [updated, setUpdated] = useState(false);
    const [sort, setSort] = useState('');
    const [discount, setDiscount] = useState('');
    const [openFilter, setOpenFilter] = useState(false);
    const [price, setPrice] = useState({
        From: '',
        To: '',
    });

    useEffect(() => {
        const queries = Object.fromEntries([...params]);

        if (queries.category) {
            setSeclected([queries.category]);
        }
        if (queries.mainCategory) {
            setSelectedMainField([queries.mainCategory]);
        }
        if (queries.From && queries.To)
            setPrice({
                From: queries.From,
                To: queries.To,
            });
    }, [location.search]);

    const fetchProducts = async (queries) => {
        dispatch(getProducts(queries));
    };

    const pageCount = Math.ceil((products?.counts || 1) / +process.env.REACT_APP_PRODUCT_PER_PAGE);
    const changePage = ({ selected }) => {
        setCurrentPage(selected);
    };

    useEffect(() => {
        const queries = Object.fromEntries([...params]);

        if (sort) queries.sort = sort;

        if (currentPage) {
            queries.page = currentPage + 1;
        } else delete queries.page;

        if (selectedMainField.join(',')) {
            queries.mainCategory = selectedMainField.join(',');
        }

        if (selected.join(',')) {
            queries.category = selected.join(',');
        }

        if (price.From) queries.From = +price.From;
        if (price.To) queries.To = +price.To;

        navigate(
            {
                pathname: location.pathname,
                search: createSearchParams({
                    ...queries,
                    ...searchValue,
                    ...filterProductValue,
                }).toString(),
            },
            { replace: true },
        );

        fetchProducts({
            ...queries,
            ...searchValue,
            ...filterProductValue,
            category: queries.category || (t(isProductPath) !== 'Sản phẩm' ? t(isProductPath) : null),
            ...discount,
        });
        // eslint-disable-next-line
    }, [params, sort, currentPage, updated, valueCategory, discount, isProductPath]);

    const handleFilter = () => {
        setUpdated(!updated);
        setCurrentPage(0);
        setOpenFilter(false);
    };

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
                {isLoading ? (
                    <div className="grid desktop:grid-cols-4 tablet:grid-cols-3 iPadmini:grid-cols-2 phone:grid-cols-1 auto-rows-auto gap-10 px-4">
                        {products?.products?.map((product) => (
                            <div
                                key={product._id}
                                className="flex w-[226px] h-[316px] bg-gray-200 rounded-lg animate-pulse"
                            ></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid desktop:grid-cols-4 tablet:grid-cols-3 iPadmini:grid-cols-2 phone:grid-cols-1 auto-rows-auto gap-10 px-4">
                        {products?.products?.map((product) => (
                            <Product product={product} key={product._id} />
                        ))}
                    </div>
                )}

                <ReactPaginate
                    forcePage={currentPage}
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
