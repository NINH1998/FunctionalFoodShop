import { useCallback, useLayoutEffect, useState } from 'react';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { InputField, Loading } from 'Layouts/Component/public/Common';
import { Pagination, Space } from 'antd';
import { apiGetUsers } from 'Context/StoreApi';
import withComponent from 'Hocs/withComponent';
import useDebounce from 'Hooks/useDebounce';
import UserTable from './UserTable';

const ManageUser = ({ navigate, location }) => {
    const [params] = useSearchParams();
    const [userInfo, setUserInfo] = useState();
    const [searchValue, setSearchValue] = useState({ q: '' });
    const [edit, setEdit] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [counts, setCounts] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [updated, setUpdated] = useState(false);

    const fetchUsers = async (params) => {
        setIsLoading(true);
        const response = await apiGetUsers(params);
        setIsLoading(false);
        if (response.success) {
            setUserInfo(response.users);
            setCounts(response.counts);
        }
    };

    const debounceValue = useDebounce(searchValue.q, 500);
    useLayoutEffect(() => {
        const queries = Object.fromEntries([...params]);
        if (debounceValue) {
            queries.q = debounceValue;
        } else delete queries.q;
        queries.page = currentPage;
        navigate(
            {
                pathname: location.pathname,
                search: createSearchParams(queries).toString(),
            },
            { replace: true },
        );
        fetchUsers(queries);
        // eslint-disable-next-line
    }, [params, updated, debounceValue, currentPage]);

    const handleSearch = useCallback((value) => {
        setSearchValue(value);
    }, []);

    const changePage = (page, pageSize) => {
        setCurrentPage(page);
        setEdit(null);
    };

    return (
        <div className="w-full">
            <div className="h-[65.6px] w-full"></div>
            <div className="fixed max-phone:top-[35px] top-0 flex gap-2 items-center px-4 py-2 uppercase text-primary z-[998] shadow-md bg-gray-100 w-full">
                <h3>Quản lý người dùng</h3>
            </div>
            <div className="w-full p-2">
                <div className="flex justify-end">
                    <div className="laptop:w-[350px]">
                        <InputField
                            nameKey={'q'}
                            placeholder="Tìm kiếm người dùng..."
                            value={searchValue.q}
                            setValue={handleSearch}
                        />
                    </div>
                </div>
                <Space direction="vertical" className="w-full">
                    <div className="desktop:w-main phone:w-full">
                        {isLoading ? (
                            <div className="flex w-full mt-4 min-h-[98px] items-center justify-center">
                                <Loading color={'#be185d'} />
                            </div>
                        ) : (
                            <UserTable
                                edit={edit}
                                setEdit={setEdit}
                                userInfo={userInfo}
                                updated={updated}
                                setUpdated={setUpdated}
                            />
                        )}
                    </div>
                    <div className="p-2">
                        <Pagination
                            total={counts}
                            showTotal={(total) => `Tổng số ${total} sản phẩm`}
                            pageSize={+process.env.REACT_APP_USER_MANAGE}
                            onChange={changePage}
                            current={currentPage}
                        />
                    </div>
                </Space>
            </div>
        </div>
    );
};

export default withComponent(ManageUser);
