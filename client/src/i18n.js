import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                home: 'Home',
                about: 'About',
            },
        },
        vi: {
            translation: {
                checkout: 'Thanh toán',
                cart: 'Giỏ hàng',
                contact: 'Liên hệ',
                'thuc-pham-chuc-nang': 'Thực phẩm chức năng',
                'cham-soc-suc-khoe': 'Chăm sóc sức khỏe',
                '%C4%91ong-trung-ha-thao': 'Đông trùng hạ thảo',
                'san-pham': 'Sản phẩm',
                san_pham: 'Sản phẩm',
                sua: 'Sữa',
                'sua-rua-mat': 'Sữa rửa mặt',
            },
        },
    },
    lng: 'vi',
    fallbackLng: 'vi',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
