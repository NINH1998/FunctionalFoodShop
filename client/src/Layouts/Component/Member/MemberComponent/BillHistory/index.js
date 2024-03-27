import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useSearchParams, createSearchParams } from 'react-router-dom';
import { apiGetBill, apiUpdateStatusBill } from 'Context/StoreApi';
import { Pagination, Space } from 'antd';
import { statusBill } from 'Ultils/Contants';
import { Loading } from 'Layouts/Component/public/Common';
import UserBillTable from './UserBillTable';
import withComponent from 'Hocs/withComponent';
import CustomSelect from 'Layouts/Component/public/Common/CustomSelect';
import Swal from 'sweetalert2';

const BillHistory = ({ navigate, location }) => {
    const [params] = useSearchParams();
    const [bills, setBills] = useState(null);
    const [counts, setCounts] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState();
    const [update, setUpdate] = useState(false);

    const render = useCallback(() => {
        setUpdate(!update);
    }, [update]);

    const handleSearchBill = async (data) => {
        setIsLoading(true);
        const response = await apiGetBill(data);
        setIsLoading(false);
        if (response.success) {
            setBills(response.bill);
            setCounts(response.counts);
        }
    };

    const handleSearchStatus = useCallback((data) => {
        const searchParams = Object.fromEntries([...params]);
        setStatus(data);
        if (data) {
            navigate(
                {
                    pathname: location.pathname,
                    search: createSearchParams({ status: data.value, page: 1 }).toString(),
                },
                { replace: true },
            );
        } else {
            delete searchParams.status;
            navigate(
                {
                    pathname: location.pathname,
                    search: createSearchParams(searchParams).toString(),
                },
                { replace: true },
            );
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        handleSearchBill(queries);
        // eslint-disable-next-line
    }, [params, update]);

    useLayoutEffect(() => {
        const queries = Object.fromEntries([...params]);
        if (!queries.page) handleSearchBill();
        // eslint-disable-next-line
    }, []);

    const changePage = (page, pageSize) => {
        setCurrentPage(page);
        const queries = Object.fromEntries([...params]);
        queries.page = page;
        queries.limit = pageSize;
        navigate(
            {
                pathname: location.pathname,
                search: createSearchParams(queries).toString(),
            },
            { replace: true },
        );

        handleSearchBill(queries);
    };

    useLayoutEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        if (+searchParams.page) changePage(+searchParams.page, +process.env.REACT_APP_HISTORY_BILL);
        // eslint-disable-next-line
    }, [params]);

    const handleCancelBill = async (bid) => {
        Swal.fire({
            text: 'Bạn có muốn hủy đơn hàng này',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiUpdateStatusBill({ status: 'cancelled' }, bid);
                if (response.success) render();
            }
        });
    };

    return (
        <div className="relative flex flex-col gap-4 w-full h-full">
            <h3 className="flex items-center sticky phone:top-[35px] laptop:top-0 p-4 h-[50px] w-full uppercase text-primary shadow-md z-10 bg-gray-100">
                Lịch sử mua hàng
            </h3>
            <div className="w-full flex justify-end px-6">
                <div className="laptop:w-[300px]">
                    <CustomSelect
                        options={statusBill}
                        value={status}
                        onChange={(e) => handleSearchStatus(e)}
                        placeholder="Lọc theo trạng thái"
                    />
                </div>
            </div>
            <div className="p-2 flex flex-col justify-center items-center min-h-[70vh] w-full">
                {isLoading ? (
                    <div className="">
                        <Loading color={'#be185d'} />
                    </div>
                ) : (
                    <Space direction="vertical" className="w-full">
                        {counts === 0 ? (
                            <p className="italic text-center">Không tìm thấy sản phẩm nào</p>
                        ) : (
                            <div className="desktop:w-main phone:w-full m-auto overflow-x-auto">
                                <UserBillTable bills={bills} handleCancelBill={handleCancelBill} />
                            </div>
                        )}
                        <div className="p-2 laptop:text-end phone:text-center">
                            <Pagination
                                total={counts}
                                showTotal={(total) => `Tổng số ${total} đơn hàng`}
                                pageSize={+process.env.REACT_APP_HISTORY_BILL}
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

export default withComponent(BillHistory);
