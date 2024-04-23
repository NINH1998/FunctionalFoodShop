import { showLoginModal } from 'Context/Reducer/AppState/CommonAction';
import { Skeleton } from 'antd';
import { Button } from 'Layouts/Component/public/Common';
import { Icons } from 'Layouts/Assets/icons';
import DropdownCustom from 'Layouts/Component/public/Common/DropdownCustom';
import withComponent from 'Hocs/withComponent';
import DropdownUser from './DropdownUser';

const { IoIosLogIn } = Icons;

const UserProfileMenu = ({ current, dispatch, useSelector }) => {
    const { isLoggedIn, isLoading } = useSelector((state) => state.userReducer);

    return (
        <>
            {isLoggedIn && current ? (
                <DropdownCustom content={<DropdownUser current={current} />} placement="bottomLeft">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <span className="phone:hidden iPadmini:block font-semibold text-base cursor-pointer animation-200 font-arima">
                            {current?.googleFullName
                                ? current.googleFullName
                                : `${current?.firstname} ${current?.lastname}`}
                        </span>
                        <img
                            src={current?.avatar}
                            alt="Avatar"
                            className="object-cover w-[40px] h-[40px] rounded-full"
                        />
                    </div>
                </DropdownCustom>
            ) : isLoading ? (
                <Skeleton.Avatar
                    style={{ backgroundColor: '#f3f4f6' }}
                    active
                    shape="circle"
                    size={35}
                ></Skeleton.Avatar>
            ) : (
                <Button
                    styles="btn-primary"
                    iconAfter={<IoIosLogIn size={20} />}
                    handleOnclick={() => dispatch(showLoginModal({ isOpenLoginModal: true }))}
                >
                    <p className="text-sm max-phone:hidden">Đăng nhập</p>
                </Button>
            )}
        </>
    );
};

export default withComponent(UserProfileMenu);
