import axios from 'axiosApi';

export const apiGetComments = (params) =>
    axios({
        url: '/api/comments/',
        method: 'get',
        params,
    });

export const apiCreateComment = (data) =>
    axios({
        url: '/api/comments/',
        method: 'post',
        data,
    });

export const apiCreateReplies = (data, commentid) =>
    axios({
        url: '/api/comments/reply/' + commentid,
        method: 'post',
        data,
    });

export const apiLikeComment = (commentid) =>
    axios({
        url: '/api/comments/like-comment/' + commentid,
        method: 'put',
    });

export const apiDislikeComment = (commentid) =>
    axios({
        url: '/api/comments/dislike-comment/' + commentid,
        method: 'put',
    });

export const apiLikeReply = (data) =>
    axios({
        url: '/api/comments/like-reply/',
        method: 'put',
        data,
    });

export const apiDislikeReply = (data) =>
    axios({
        url: '/api/comments/dislike-reply/',
        method: 'put',
        data,
    });

export const apiEditComment = (data, commentid) =>
    axios({
        url: '/api/comments/edit-comment/' + commentid,
        method: 'put',
        data,
    });

export const apiEditReply = (data) =>
    axios({
        url: '/api/comments/edit-reply/',
        method: 'put',
        data,
    });

export const apiDeleteComment = (commentid) =>
    axios({
        url: '/api/comments/delete-comment/' + commentid,
        method: 'delete',
    });

export const apiDeleteReply = (data) =>
    axios({
        url: '/api/comments/delete-reply',
        method: 'delete',
        data,
    });
