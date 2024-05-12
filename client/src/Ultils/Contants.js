import { Icons, Images } from 'Layouts/Assets/icons';
import { showModal } from 'Context/Reducer/AppState/CommonAction';
import ReactHtmlParser from 'html-react-parser';
import path from '../Router/path';

const {
    LuLayoutDashboard,
    MdGroups3,
    FaProductHunt,
    RiBillLine,
    FaRegStar,
    FaChevronDown,
    FaPlus,
    FaMinus,
    RxReset,
    IoClose,
} = Icons;

export const Navigation = [
    {
        id: 1,
        value: 'Trang chủ',
        path: `/${path.HOMEPAGE}`,
    },
    {
        id: 2,
        value: 'Sản phẩm',
        icon: <FaChevronDown color="#4d7c0f" size={12} />,
        path: `/${path.TOTAL_PRODUCTS}`,
    },
    {
        id: 3,
        value: 'Liên hệ',
        path: `/${path.CONTACT}`,
    },
];

export const navPhoneMenu = [
    {
        id: 1,
        value: 'Sản phẩm',
        icon: <FaChevronDown color="#4d7c0f" size={12} />,
    },
    {
        id: 2,
        value: 'Liên hệ',
    },
];

// PRIVATE ACCOUNT

export const userList = [
    { id: 0, title: 'Thông tin cá nhân', path: `/${path.MEMBER}/${path.PERSONAL}` },
    { id: 1, title: 'Lịch sử mua hàng', path: `/${path.MEMBER}/${path.HISTORY}` },
    { id: 2, title: 'Sản phẩm yêu thích', path: `/${path.MEMBER}/${path.WISHLIST}` },
];

export const adminSidebar = [
    {
        id: 1,
        type: 'single',
        text: 'Quản lý người dùng',
        path: `/${path.ADMIN}/${path.MANAGE_USER}`,
        icon: <MdGroups3 />,
    },
    {
        id: 2,
        type: 'parent',
        text: 'Quản lý sản phẩm',
        sub: [
            {
                text: 'Tạo sản phẩm',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`,
            },
            {
                text: 'Quản lý sản phẩm',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
            },
        ],
        icon: <FaProductHunt />,
    },
    {
        id: 3,
        type: 'single',
        text: 'Đơn hàng',
        path: `/${path.ADMIN}/${path.MANAGE_BILL}`,
        icon: <RiBillLine />,
    },
];

export const memberSidebar = [
    {
        id: 1,
        type: 'single',
        text: 'Thông tin cá nhân',
        path: `/${path.MEMBER}/${path.PERSONAL}`,
        icon: <LuLayoutDashboard size="14px" />,
    },
    {
        id: 2,
        type: 'single',
        text: 'Lịch sử mua hàng',
        path: `/${path.MEMBER}/${path.HISTORY}`,
        icon: <RiBillLine />,
    },
    {
        id: 3,
        type: 'single',
        text: 'Sản phẩm yêu thích',
        path: `/${path.MEMBER}/${path.WISHLIST}`,
        icon: <FaRegStar />,
    },
];

export const roles = [
    { value: 'enikk', label: 'Admin' },
    { value: 'pilgrims', label: 'User' },
];

export const block = [
    { value: 'false', label: 'Active' },
    { value: 'true', label: 'Blocked' },
];

export const statusBill = [
    { id: 1, label: 'Hoàn thành', value: 'successed' },
    { id: 2, label: 'Đang chờ', value: 'processing' },
    { id: 3, label: 'Đã hủy', value: 'cancelled' },
];

// PRODUCT

export const sortsByOrder = [
    {
        id: 0,
        value: '-createdAt',
        label: 'Mới nhất',
    },
    {
        id: 1,
        value: 'createdAt',
        label: 'Cũ nhất',
    },
    {
        id: 2,
        value: 'discount',
        label: '*Khuyến mãi',
    },
    {
        id: 3,
        value: '-sold',
        label: 'Bán chạy',
    },
    {
        id: 4,
        value: '-title',
        label: 'Sắp xếp theo thứ tự A-Z',
    },
    {
        id: 5,
        value: 'title',
        label: 'Sắp xếp theo thứ tự Z-A',
    },
    {
        id: 6,
        value: '-price',
        label: 'Giá từ cao đến thấp',
    },
    {
        id: 7,
        value: 'price',
        label: 'Giá từ thấp đến cao',
    },
];

export const ratingStar = [
    {
        id: 1,
        content: 'Rất tệ',
    },
    {
        id: 2,
        content: 'Tệ',
    },
    {
        id: 3,
        content: 'Bình thường',
    },
    {
        id: 4,
        content: 'Tốt',
    },
    {
        id: 5,
        content: 'Rất tốt',
    },
];

export const detailProductInfo = (product) => [
    { title: 'Thương hiệu:', value: product?.brand },
    { title: 'Số lượng còn:', value: product?.quantity },
    { title: 'Đã bán:', value: product?.sold > 0 ? product?.sold : null },
    { title: 'Xuất xứ:', value: product?.origin },
    { title: 'Đơn vị:', value: product?.unitCalculation },
];

export const menuPreviewBtn = (props) => [
    { id: 0, tooltip: 'Phóng to', handleClick: () => props.zoomIn(), icon: <FaPlus size={24} color="white" /> },
    { id: 1, tooltip: 'Thu nhỏ', handleClick: () => props.zoomOut(), icon: <FaMinus size={24} color="white" /> },
    {
        id: 2,
        tooltip: 'Hoàn lại kích cỡ',
        handleClick: () => props.resetTransform(),
        icon: <RxReset style={{ strokeWidth: '1px' }} size={24} color="white" />,
    },
    {
        id: 3,
        tooltip: 'Đóng',
        handleClick: () => props.dispatch(showModal({ isShowModal: false })),
        icon: <IoClose style={{ strokeWidth: '8px' }} size={28} fontWeight={700} color="white" />,
    },
];

// FOOTER

export const storePolicy = [
    {
        image: Images.TruckReturnIcon,
        title: 'Đổi trả hàng',
        content: 'Chính sách đổi trả',
    },
    {
        image: Images.TruckDeliveryIcon,
        title: 'Miễn phí vận chuyển',
        content: 'Miễn phí vân chuyển khi mua từ 2 sản phẩm',
    },
    {
        image: Images.PhoneContactIcon,
        title: 'Liên hệ',
        content: ReactHtmlParser('0969933816 <br/> liendoctor@gmail.com'),
    },
];

export const ownerInfomation = [
    {
        content: ReactHtmlParser(
            '<strong>Địa chỉ: </strong>Số 995, tổ 1 khu 10 Phường Bãi Cháy, TP.Hạ Long, Quảng Ninh',
        ),
    },
    {
        content: ReactHtmlParser('<strong>SĐT: </strong>0969933816'),
    },
    {
        content: ReactHtmlParser('<strong>Email: </strong>liendoctor@gmail.com'),
    },
    {
        content: ReactHtmlParser('<strong>Zalo: </strong>0969933816 Trần Thị Kim Liên'),
    },
];
