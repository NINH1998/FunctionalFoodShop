import {
    CartPage,
    ProductsPage,
    DetailProductPage,
    MainPage,
    ContactPage,
    ResetPasswordPage,
    CheckoutPage,
} from 'Layouts/Component/public/Pages';
import { CreateProduct, ManageBill, ManageProducts, ManageUser } from 'Layouts/Component/Admin/AdminComponent';
import { BillHistory, Personal, UserWishlist } from 'Layouts/Component/Member/MemberComponent';
import path from './path';

const PublicPages = [
    { path: path.HOMEPAGE, component: MainPage },
    { path: path.CART, component: CartPage },
    { path: path.CHECK_OUT, component: CheckoutPage },
    { path: path.CONTACT, component: ContactPage },
    { path: path.PRODUCTS, component: ProductsPage },
    { path: path.DETAIL_PRODUCT_CATEGORY_PID_TITLE, component: DetailProductPage },
    { path: path.RESET_PASSWORD, component: ResetPasswordPage },
];

const AdminPrivatePages = [
    { path: path.MANAGE_USER, component: ManageUser },
    { path: path.MANAGE_PRODUCTS, component: ManageProducts },
    { path: path.MANAGE_BILL, component: ManageBill },
    { path: path.CREATE_PRODUCT, component: CreateProduct },
];

const MemberPrivatePages = [
    { path: path.PERSONAL, component: Personal },
    { path: path.WISHLIST, component: UserWishlist },
    { path: path.HISTORY, component: BillHistory },
];

export { PublicPages, AdminPrivatePages, MemberPrivatePages };
