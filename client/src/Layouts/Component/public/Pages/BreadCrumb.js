import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from 'antd';
import React from 'react';
import path from 'Router/path';

const BreadCrumbs = ({ pid, isDetailPage }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const { pathname } = location;
    const pathnames = pathname.split('/').filter((item) => item !== pid && item !== '');

    return (
        <Breadcrumb
            items={[
                {
                    title: pathnames.length > 0 && (
                        <Link to={`/${path.HOMEPAGE}`} className="breadcrumb-link-btn">
                            Trang chủ
                        </Link>
                    ),
                },
                {
                    title: isDetailPage && pathnames.length > 0 && (
                        <Link to={`/${path.TOTAL_PRODUCTS}`} className="breadcrumb-link-btn">
                            Sản phẩm
                        </Link>
                    ),
                },
            ].concat(
                (isDetailPage ? pathnames.slice(0, -1) : pathnames).map((name, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = isDetailPage ? index === pathnames.length - 2 : index === pathnames.length - 1;
                    const breadcrumbName = t(name);

                    return {
                        title: isLast ? (
                            <div className="text-base font-semibold">{breadcrumbName}</div>
                        ) : (
                            <Link key={index} to={routeTo} className="breadcrumb-link-btn">
                                {breadcrumbName}
                            </Link>
                        ),
                    };
                }),
            )}
        />
    );
};

export default BreadCrumbs;
