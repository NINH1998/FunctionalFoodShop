import axios from 'axiosApi';

export const apiGetTag = () =>
    axios({
        url: '/api/tag/',
        method: 'get',
    });

export const apiCreateNewTag = (data) =>
    axios({
        url: '/api/tag/',
        method: 'post',
        data,
    });

export const apiGetProductsByTag = (tagId) =>
    axios({
        url: '/api/tag/getProductByTag/' + tagId,
        method: 'get',
    });

export const apiGetTagByProduct = (pid) =>
    axios({
        url: '/api/tag/getTagByProduct/' + pid,
        method: 'get',
    });

export const apiCreateProductTag = (data, pid) =>
    axios({
        url: '/api/tag/createProductTag/' + pid,
        method: 'post',
        data,
    });
