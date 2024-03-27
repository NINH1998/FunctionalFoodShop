import { menuPreviewBtn } from 'Ultils/Contants';
import { IconsButton } from 'Layouts/Component/public/Common';
import { memo } from 'react';
import withComponent from 'Hocs/withComponent';

const MenuPreviewBtn = ({ children, dispatch, zoomIn, zoomOut, resetTransform, ...rest }) => {
    const menuBtn = menuPreviewBtn({ dispatch, zoomIn, zoomOut, resetTransform });
    return (
        <div className="flex items-center justify-end w-full my-2 z-50">
            {menuBtn.map((el) => (
                <IconsButton
                    key={el.id}
                    tooltip="Đóng"
                    handleOnclick={el.handleClick}
                    styles="mx-2 outline-none opacity-70 hover:opacity-100 animation-200 cursor-pointer"
                    icon={el.icon}
                />
            ))}
        </div>
    );
};

export default withComponent(memo(MenuPreviewBtn));
