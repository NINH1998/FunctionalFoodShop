import { Icons } from 'Layouts/Assets/icons';
import { memo } from 'react';
import clsx from 'clsx';

const { IoMdClose } = Icons;

const CloseModalButton = ({ onClose, iconSize, styles }) => {
    return (
        <span
            onClick={onClose}
            className={clsx(styles ? styles : 'absolute top-2 right-2 p-1 hover:bg-gray-200 cursor-pointer')}
        >
            <IoMdClose size={iconSize || 20} />
        </span>
    );
};

export default memo(CloseModalButton);
