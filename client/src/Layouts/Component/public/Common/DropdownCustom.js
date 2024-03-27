import { Dropdown, Space } from 'antd';

const DropdownCustom = ({ children, content, placement, trigger }) => {
    return (
        <Dropdown
            placement={placement}
            trigger={trigger}
            dropdownRender={() => <div className="bg-white p-2 shadow-large rounded-lg font-arima text-base">{content}</div>}
        >
            <Space>{children}</Space>
        </Dropdown>
    );
};

export default DropdownCustom;
