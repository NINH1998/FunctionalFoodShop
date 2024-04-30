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
                san_pham: 'Sản phẩm',
                'san-pham': 'Sản phẩm',
                checkout: 'Thanh toán',
                contact: 'Liên hệ',
                cart: 'Giỏ hàng',
                'thuc-pham-chuc-nang': 'Thực phẩm chức năng',
                'cham-soc-suc-khoe': 'Chăm sóc sức khỏe',
                'djong-trung-ha-thao': 'Đông trùng hạ thảo',
                'an-cung-nguu-hoang': 'An Cung Ngưu Hoàng',
                'linh-chi-han-quoc': 'Linh chi Hàn Quốc',
                'hoa-anh-thao': 'Hoa Anh Thảo',
                'tang-can-giam-can': 'Tăng cân giảm cân',
                'vien-uong-djep-da': 'Viên uống đẹp da',
                'bo-gan': 'Bổ gan',
                'thuoc-djac-tri': 'Thuốc đặc trị',
                'tinh-chat-nghe': 'Tinh chất nghệ',
                'tinh-dau-thong-djo': 'Tinh dầu thông đỏ',
                'banh-keo': 'Bánh kẹo',
                'hoa-qua-han-quoc': 'Hoa quả Hàn Quốc',
                'sua-noi-djia-han-quoc': 'Sữa nội địa Hàn Quốc',
                'thuc-pham-bo-sung': 'Thực phẩm bổ sung',
                'cao-sam-han-quoc': 'Cao sâm Hàn Quốc',
                'hong-sam-han-quoc': 'Hồng sâm Hàn Quốc',
                'nuoc-sam-han-quoc': 'Nước sâm Hàn Quốc',
                'sam-kho-han-quoc': 'Sâm khô Hàn Quốc',
                'ruou-han-quoc': 'Rượu Hàn Quốc',
                'cao-linh-chi-han-quoc': 'Cao linh chi Hàn Quốc',
                'djam-tong-hop': 'Đạm tổng hợp',
                'nam-linh-chi-han-quoc': 'Nấm linh chi Hàn Quốc',
                tra: 'Trà',
                'omega-3': 'Omega 3',
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
