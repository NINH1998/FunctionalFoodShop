import { useEffect, useRef } from 'react';
import { BreadCrumb } from '../index';
import { Images } from 'Layouts/Assets/icons';
import FilteredProducts from './FilteredProducts';
import withComponent from 'Hocs/withComponent';

const ProductsPage = ({ location }) => {
    const breadcrumbRef = useRef();

    useEffect(() => {
        breadcrumbRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [location.pathname]);

    return (
        <div className="relative h-auto">
            <div className="w-full px-6 py-3 text-end bg-gray-200" ref={breadcrumbRef}>
                <BreadCrumb />
            </div>
            <div className="relative flex flex-col items-center px-4 py-10">
                <FilteredProducts />
            </div>
        </div>
    );
};

export default withComponent(ProductsPage);
