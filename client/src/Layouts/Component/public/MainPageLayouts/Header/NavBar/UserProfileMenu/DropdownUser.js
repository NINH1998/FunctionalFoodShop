import { useDispatch, useSelector } from 'react-redux';
import { IoIosLogOut } from 'react-icons/io';
import { userList } from 'Ultils/Contants';
import { Button } from 'Layouts/Component/public/Common';
import { logout } from 'Context/Reducer/User/UserAction';
import { Link } from 'react-router-dom';
import path from 'Router/path';
import Swal from 'sweetalert2';

const DropdownUser = ({ current }) => {
    const dispatch = useDispatch();
    const { isGoogleLogin } = useSelector((state) => state.googleLoginReducer);

    const handleLogout = () => {
        if (current && !isGoogleLogin) {
            Swal.fire({
                text: 'Bạn có chắc muốn đăng xuất?',
                showCancelButton: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('user');
                    dispatch(logout({ isLoggedIn: false, current: null, token: null, currentCart: [] }));
                }
            });
        } else {
            Swal.fire({
                text: 'Bạn có chắc muốn đăng xuất?',
                showCancelButton: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    window.location.href = process.env.REACT_APP_URL_GOOGLE_LOGOUT;
                    localStorage.removeItem('user');
                }
            });
        }
    };

    return (
        <div className="flex flex-col items-center font-roboto">
            {userList.map((el) => (
                <Link
                    key={el.id}
                    className="p-2 flex justify-center items-center hover:bg-gray-200 hover:text-primary text-base w-full text-center rounded"
                    to={el.path}
                >
                    {el.icon}
                    <span className="ml-1"> {el.title}</span>
                </Link>
            ))}
            {current?.role === 'enikk' && (
                <Link
                    to={`/${path.ADMIN}/${path.MANAGE_USER}`}
                    className="flex p-2 w-full justify-center items-center hover:bg-gray-200 hover:text-primary cursor-pointer rounded "
                >
                    <span className="ml-1">Admin</span>
                </Link>
            )}
            <Button
                handleOnclick={handleLogout}
                styles="flex p-2 w-full justify-center items-center hover:bg-red-100 cursor-pointer rounded"
                iconBefore={<IoIosLogOut size="20px" />}
            >
                <span className="ml-1">Đăng xuất</span>
            </Button>
        </div>
    );
};

export default DropdownUser;
