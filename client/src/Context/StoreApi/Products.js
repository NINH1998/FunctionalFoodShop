import axios from 'axiosApi';

export const apiGetProducts = (params) =>
    axios({
        url: '/api/products/',
        method: 'get',
        params,
    });

export const apiGetProduct = (pid) =>
    axios({
        url: '/api/products/' + pid,
        method: 'get',
    });

export const apiRating = (data) =>
    axios({
        url: '/api/products/ratings',
        method: 'put',
        data,
    });

export const apiCreateProduct = (data) =>
    axios({
        url: '/api/products/',
        method: 'post',
        data,
    });

export const apiUpdateProduct = (data, pid) =>
    axios({
        url: '/api/products/' + pid,
        method: 'put',
        data,
    });

export const apiDeleteProduct = (pid) =>
    axios({
        url: '/api/products/' + pid,
        method: 'delete',
    });

export const apiCreateBill = (data) =>
    axios({
        url: '/api/bill/',
        method: 'post',
        data,
    });
