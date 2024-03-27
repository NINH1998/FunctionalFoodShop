import axios from 'axiosApi';

export const getProductCategory = () =>
    axios({
        url: `/api/productcategory`,
        method: 'GET',
    });

export const apiCreateProductCategory = (data) =>
    axios({
        url: `/api/productcategory/`,
        method: 'POST',
        data,
    });

export const apiCreateTitleItem = ({ pcid, data }) =>
    axios({
        url: `/api/productcategory/` + pcid,
        method: 'PUT',
        data,
    });

export const apiEditTitle = ({ pcid, data }) =>
    axios({
        url: `/api/productcategory/edit-title/` + pcid,
        method: 'PUT',
        data,
    });

export const apiEditTitleItem = ({ pcid, data }) =>
    axios({
        url: `/api/productcategory/edit-item/` + pcid,
        method: 'PUT',
        data,
    });

export const apiDeleteCategory = (pcid) =>
    axios({
        url: `/api/productcategory/` + pcid,
        method: 'DELETE',
    });

export const apiDeleteCategoryItem = ({ pcid, data }) =>
    axios({
        url: `/api/productcategory/removeItem/` + pcid,
        method: 'DELETE',
        data,
    });
