import { useEffect, useState } from 'react';
import { apiGetBillsByAdmin } from 'Context/StoreApi';
import { Icons } from 'Layouts/Assets/icons';
import NotificationBillList from './NotificationBillList';
import DropdownCustom from 'Layouts/Component/public/Common/DropdownCustom';
import withComponent from 'Hocs/withComponent';
import io from 'socket.io-client';

const { IoNotifications } = Icons;

const NotificationMenu = ({ current }) => {
    const [unreadBillCount, setUnreadBillCount] = useState(0);
    const [socket, setSocket] = useState(null);
    const [bills, setBills] = useState();

    useEffect(() => {
        const handleGetBills = async () => {
            const response = await apiGetBillsByAdmin({ limit: 5, sort: '-createdAt' });
            if (response.success) {
                setBills(response.bills);
            }
        };
        handleGetBills();
    }, [current]);

    useEffect(() => {
        const newSocket = io('http://localhost:5000');

        newSocket.on('connect', () => {
            console.log('Connected to server');
            setSocket(newSocket);
        });

        newSocket.emit('getUnreadOrderCount');

        newSocket.on('unreadOrderCount', (count) => {
            setUnreadBillCount(count);
        });

        return () => {
            if (socket) {
                newSocket.disconnect();
            }
        };
    }, []);

    const handleMarkBillAsRead = () => {
        if (socket) {
            socket.emit('markBillAsRead');
            setUnreadBillCount(0);
        }
    };
    return (
        <DropdownCustom content={<NotificationBillList bills={bills} />} placement="bottomRight" trigger={'click'}>
            <div className="relative mr-4 cursor-pointer" onClick={handleMarkBillAsRead}>
                <IoNotifications size={32} color="#65a30d" />
                {unreadBillCount > 0 && (
                    <span className="absolute right-0 bottom-0 p-2 flex justify-center items-center rounded-full h-2 w-2 bg-red-500 text-[10px] text-white font-bold font-roboto">
                        {unreadBillCount}
                    </span>
                )}
            </div>
        </DropdownCustom>
    );
};

export default withComponent(NotificationMenu);
