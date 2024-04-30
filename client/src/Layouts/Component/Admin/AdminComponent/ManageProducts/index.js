import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useSearchParams, createSearchParams } from 'react-router-dom';
import { apiDeleteProduct, apiGetProducts } from 'Context/StoreApi';
import { InputField, Loading } from 'Layouts/Component/public/Common';
import { Pagination, Space } from 'antd';
import ProductsTable from './ProductsTable';
import withComponent from 'Hocs/withComponent';
import UpdateProduct from './ProductAction/UpdateProduct';
import useDebounce from 'Hooks/useDebounce';
import Swal from 'sweetalert2';

const ManageProducts = ({ navigate, location }) => {
    const [params] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(Object.fromEntries([...params]).page || 1);
    const [products, setProducts] = useState(null);
    const [counts, setCounts] = useState(null);
    const [value, setValue] = useState({ q: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [update, setUpdate] = useState(false);

    const render = useCallback(() => {
        setUpdate(!update);
    }, [update]);

    const handleSearchProduct = async (data) => {
        setIsLoading(true);
        const response = await apiGetProducts(data);
        setIsLoading(false);
        if (response.success) {
            setProducts(response.products);
            setCounts(response.counts);
        }
    };

    const debounceValue = useDebounce(value.q, 500);
    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        if (queries.q) {
            queries.q = debounceValue;
        }

        if (currentPage > 1) {
            queries.page = currentPage;
        } else delete queries.page;

        navigate(
            {
                pathname: location.pathname,
                search: createSearchParams({ ...queries }).toString(),
            },
            { replace: true },
        );
        handleSearchProduct({ ...queries });

        // eslint-disable-next-line
    }, [update, currentPage]);

    useEffect(() => {
        if (debounceValue) {
            navigate(
                {
                    pathname: location.pathname,
                    search: createSearchParams({ q: debounceValue, page: 1 }).toString(),
                },
                { replace: true },
            );
            setCurrentPage(1);
            handleSearchProduct({ q: debounceValue, page: 1 });
        }
        // eslint-disable-next-line
    }, [debounceValue]);

    const changePage = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = useCallback((value) => {
        setValue(value);
    }, []);

    const handleEdit = useCallback((data) => {
        setEditProduct(data);
    }, []);

    const handleDeleteProduct = useCallback((pid) => {
        Swal.fire({
            text: 'Bạn có chắc muốn xóa sản phẩm này?',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const rs = await apiDeleteProduct(pid);
                if (rs.success) render();
            }
        });
        // eslint-disable-next-line
    }, []);

    return (
        <div className="relative flex flex-col gap-4 w-full">
            <h3 className="phone:sticky phone:top-[35px] laptop:top-0 p-3 uppercase text-primary shadow-md z-10 bg-gray-100 fixed w-full top-0">
                Quản lý sản phẩm
            </h3>
            {editProduct && (
                <div className="absolute inset-0 bg-white z-50">
                    <UpdateProduct render={render} editProduct={editProduct} setEditProduct={setEditProduct} />
                </div>
            )}
            <div className="w-full flex justify-end px-6">
                <div className="laptop:w-[350px]">
                    <InputField
                        value={value.q}
                        setValue={handleSearch}
                        nameKey={'q'}
                        placeholder={'Nhập tên sản phẩm'}
                    />
                </div>
            </div>
            <div className="p-2 flex flex-col justify-center items-center desktop:min-h-[70vh]">
                {isLoading ? (
                    <Loading color="#be185d" />
                ) : (
                    <Space direction="vertical" className="w-full">
                        {counts === 0 ? (
                            <p className="italic text-center">Không tìm thấy sản phẩm nào</p>
                        ) : (
                            <div className="w-full m-auto overflow-x-auto">
                                <ProductsTable
                                    products={products}
                                    currentPage={currentPage}
                                    handleEdit={handleEdit}
                                    handleDeleteProduct={handleDeleteProduct}
                                />
                            </div>
                        )}
                        <div className="p-2">
                            <Pagination
                                total={counts}
                                showTotal={(total) => `Tổng số ${total} sản phẩm`}
                                pageSize={+process.env.REACT_APP_PRODUCT_MANAGE}
                                onChange={changePage}
                                current={currentPage}
                            />
                        </div>
                    </Space>
                )}
            </div>
        </div>
    );
};

export default withComponent(ManageProducts);
