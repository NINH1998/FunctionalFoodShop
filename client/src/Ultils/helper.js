import { setInvalidField } from 'Context/Reducer/AppState/CommonAction';
import { Icons } from 'Layouts/Assets/icons';

const { AiFillStar, AiOutlineStar } = Icons;

export const createSlug = (string) => {
    if (string) {
        return string
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .split(' ')
            .join('-');
    }
};

export const formatPrice = (number) => Number(number?.toFixed(3)).toLocaleString();

export const generateArray = (start, end) => {
    const length = end + 1 - start;
    return Array.from({ length }, (_, index) => start + index);
};

export const starNumber = (number) => {
    if (!Number(number)) return;
    const stars = [];
    for (let i = 0; i < +number; i++) stars.push(<AiFillStar key={i} color="#facc15" />);
    for (let i = 5; i > +number; i--) stars.push(<AiOutlineStar key={i} color="#facc15" />);

    return stars;
};

export const validate = (payload, dispatch) => {
    let invalid = 0;

    const format = Object.entries(payload);
    for (let arr of format) {
        if (arr[1] === '') {
            invalid++;
            dispatch(setInvalidField({ name: arr[0], mes: 'Yêu cầu nhập trường này' }));
        }
    }

    for (let arr of format) {
        switch (arr[0]) {
            case 'email':
                // eslint-disable-next-line
                const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (!arr[1].match(regex)) {
                    invalid++;
                    dispatch(setInvalidField({ name: arr[0], mes: 'Email không đúng cú pháp' }));
                }
                break;

            case 'password':
                if (arr[1].length < 6) {
                    invalid++;
                    dispatch(setInvalidField({ name: arr[0], mes: 'Yêu cầu mật khẩu ít nhất 6 ký tự' }));
                }
                break;
            default:
                break;
        }
    }

    return invalid;
};

export const getBase64 = (file) => {
    if (!file) return;
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};
