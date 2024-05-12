import axios from 'axiosApi';

export const apiRegister = (data) =>
    axios({
        url: '/api/users/register',
        method: 'post',
        data,
        withCredentials: true,
    });

export const apiverifyOTP = (data) =>
    axios({
        url: '/api/users/verify-otp/',
        method: 'put',
        data,
    });

export const apiLogin = (data) =>
    axios({
        url: '/api/users/login',
        method: 'post',
        data,
        withCredentials: true,
    });

export const forgotPassword = (data) =>
    axios({
        url: '/api/users/forgotpassword',
        method: 'post',
        data,
    });

export const resetPassword = (data) =>
    axios({
        url: '/api/users/resetpassword',
        method: 'put',
        data,
    });

export const apiGetCurrentUser = () =>
    axios({
        url: '/api/users/current',
        method: 'get',
        withCredentials: true,
    });

export const apiGetUsers = (params) =>
    axios({
        url: '/api/users/',
        method: 'get',
        params,
    });

export const apiRefreshToken = () =>
    axios({
        url: '/api/users/refreshtoken/',
        method: 'post',
        withCredentials: true,
    });

export const apiUpdateUser = (data, uid) =>
    axios({
        url: '/api/users/' + uid,
        method: 'put',
        data,
    });

export const apiDeleteUser = (uid) =>
    axios({
        url: '/api/users/' + uid,
        method: 'delete',
    });

export const apiUpdateCurrent = (data) =>
    axios({
        url: '/api/users/current',
        method: 'put',
        data,
    });

export const apiUpdateCart = (data) =>
    axios({
        url: '/api/users/cart',
        method: 'put',
        data,
    });

export const apiRemoveCartItem = (pid) =>
    axios({
        url: '/api/users/remove-cart/' + pid,
        method: 'put',
    });

export const apiRemoveAllCart = (data) =>
    axios({
        url: '/api/users/remove-all-cart/',
        method: 'put',
        data,
    });

export const apiGetBillsByUser = (params) =>
    axios({
        url: '/api/bill/',
        method: 'get',
        params,
    });

export const apiGetBillsByAdmin = (params) =>
    axios({
        url: '/api/bill/admin',
        method: 'get',
        params,
    });

export const apiUpdateStatusBill = (data, bid) =>
    axios({
        url: '/api/bill/status/' + bid,
        method: 'put',
        data,
    });

export const apiUpdateWishlist = (pid) =>
    axios({
        url: '/api/users/wishlist/' + pid,
        method: 'put',
    });

export const apiGoogleLogin = () =>
    axios({
        url: 'api/auth/login-google/',
        method: 'get',
        withCredentials: true,
    });
