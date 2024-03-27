const path = {
    // PUBLIC...................
    PUBLIC: '/',
    HOMEPAGE: '',
    ALL: '*',
    LOGIN: 'login',
    TOTAL_PRODUCTS: 'san-pham',
    PRODUCTS: ':san_pham',
    CART: 'cart',
    CHECK_OUT: 'checkout',
    CONTACT: 'contact',
    DETAIL_PRODUCT_CATEGORY_PID_TITLE: ':category/:pid/:title',
    BLOG: 'blog',
    RESET_PASSWORD: 'resetpassword/:token',

    // PRIVATE..................
    // ADMIN
    ADMIN: 'admin',
    DASHBOARD: 'dashboard',
    MANAGE_USER: 'manage-user',
    MANAGE_PRODUCTS: 'manage-products',
    MANAGE_BILL: 'manage-bill',
    CREATE_PRODUCT: 'create-product',
    // MEMBER
    MEMBER: 'member',
    PERSONAL: 'personal',
    WISHLIST: 'wishlist',
    HISTORY: 'history',
};

export default path;
