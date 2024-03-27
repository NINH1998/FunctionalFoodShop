import { memo } from 'react';

const ProductCard = ({ thumb, isOpen }) => {
    return (
        <div className="relative w-full h-auto overflow-hidden rounded-lg">
            <div
                style={{ background: `url(${thumb}) center center / cover no-repeat` }}
                className={`w-full pb-[100%] ${isOpen && 'opacity-0'} animation cursor-pointer`}
            ></div>
            <div
                style={{ background: `url(${thumb}) center center / cover no-repeat` }}
                className={`opacity-1 absolute pb-[100%] transition-all duration-500 ease-out top-0 left-0 w-full ${
                    isOpen && 'opacity-[1] scale-105'
                } cursor-pointer`}
            ></div>
        </div>
    );
};

export default memo(ProductCard);
