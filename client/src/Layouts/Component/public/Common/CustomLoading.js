import { memo } from 'react';
import { ClipLoader } from 'react-spinners';

const Loading = ({ color, size, border, shape }) => {
    return shape ? (
        shape
    ) : (
        <ClipLoader
            size={size || 50}
            color={color ? color : 'white'}
            className={`${border ? border : '!border-[6px]'}`}
        />
    );
};

export default memo(Loading);
