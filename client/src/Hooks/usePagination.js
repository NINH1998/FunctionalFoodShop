import { useMemo } from 'react';
import { generateArray } from 'Ultils/helper';

const usePagination = (totalProductCount, currentPage, siblingCount = 1, rangeLeft = 4, rangeRight = 5) => {
    const paginateArray = useMemo(() => {
        const productPerPage = process.env.REACT_APP_PRODUCT_PER_PAGE || 5;
        const pageNumber = Math.ceil(totalProductCount / productPerPage);
        const totalPagination = siblingCount + pageNumber;
        if (pageNumber <= totalPagination) return generateArray(1, pageNumber);
        const isShowDotsLeft = currentPage - siblingCount > 2;
        const isShowDotsRight = currentPage + siblingCount < totalPagination - 2;
        if (isShowDotsLeft && !isShowDotsRight) {
            const rightStart = pageNumber - rangeLeft;
            const rightRange = generateArray(rightStart, pageNumber);
            return [1, 'DOTS', ...rightRange];
        }

        if (!isShowDotsLeft && isShowDotsRight) {
            const leftRange = generateArray(1, rangeRight);
            return [...leftRange, 'DOTS', pageNumber];
        }

        const siblingLeft = Math.max(currentPage - siblingCount, 1);
        const siblingRight = Math.min(currentPage + siblingCount, pageNumber);
        if (isShowDotsLeft && isShowDotsRight) {
            const middleRange = generateArray(siblingLeft, siblingRight);
            return [1, 'DOTS', ...middleRange, 'DOTS', pageNumber];
        }
    }, [totalProductCount, siblingCount, currentPage, rangeLeft, rangeRight]);
    return paginateArray;
};

export default usePagination;
