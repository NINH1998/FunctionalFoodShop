import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BreadCrumb } from '../index';
import FilteredProducts from './FilteredProducts';
import withComponent from 'Hocs/withComponent';

const ProductsPage = () => {
    const breadcrumbRef = useRef();
    const [params] = useSearchParams();

    useEffect(() => {
        breadcrumbRef.current.scrollIntoView({ behavior: 'auto' });
    }, [params]);

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
