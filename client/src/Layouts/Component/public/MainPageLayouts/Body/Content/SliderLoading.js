import React from 'react';

const SliderLoading = ({ numberItem, styles }) => {
    const items = Array.from({ length: numberItem || 5 }, (_, index) => index);
    return (
        <div
            className={
                styles
                    ? styles
                    : `grid desktop:grid-cols-5 phone:grid-cols-1 iPadmini:grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 gap-2`
            }
        >
            {items.map((_, index) => (
                <div key={index} className="flex h-[316px] bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
        </div>
    );
};

export default SliderLoading;
