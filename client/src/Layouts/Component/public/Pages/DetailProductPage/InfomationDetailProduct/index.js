import { memo, useEffect, useRef, useState } from 'react';
import RatingProductFunction from './RatingProductFunction';
import CommentContainer from './RatingProductFunction/CommentContainer';
import withComponent from 'Hocs/withComponent';
import DOMPurify from 'dompurify';

const InfomationDetailProduct = ({ totalRatings, ratings, productName, pid, description, setUpdateRating }) => {
    const infoTab = [
        {
            id: 0,
            label: 'Mô tả chi tiết',
            content: description,
        },
        {
            id: 1,
            label: 'Đánh giá',
        },
    ];

    const [activeTab, setActiveTab] = useState(0);
    const [tabWidths, setTabWidths] = useState([]);
    const tabRefs = useRef([]);

    useEffect(() => {
        setTabWidths(tabRefs.current.map((ref) => ref.offsetWidth));
    }, []);

    return (
        <>
            <div className="relative flex items-center">
                {infoTab.map((el, i) => (
                    <span
                        ref={(el) => (tabRefs.current[i] = el)}
                        key={el.id}
                        className={`py-2 px-4 bg-gray-100 ${
                            activeTab === el.id ? 'text-primary' : ''
                        } font-semibold text-lg cursor-pointer`}
                        onClick={() => {
                            setActiveTab(el.id);
                        }}
                    >
                        {el.label}
                    </span>
                ))}
                <div
                    className="absolute left-0 bottom-0 h-1 bg-primary"
                    style={{
                        width: `${tabWidths[activeTab]}px`,
                        transform: `translateX(${
                            activeTab * (tabWidths.reduce((sum, el) => sum + el, 0) - tabWidths[activeTab])
                        }px)`,
                        transition: '0.2s ease-in-out',
                    }}
                />
            </div>
            <div className="border-2 overflow-auto">
                <div className="w-full p-4 border-gray-300 max-h-[1500px]">
                    {activeTab === 0 && <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }} />}
                    {activeTab === 1 && (
                        <div className="flex flex-col gap-2">
                            <RatingProductFunction
                                pid={pid}
                                ratings={ratings}
                                productName={productName}
                                totalRatings={totalRatings}
                                setUpdateRating={setUpdateRating}
                            />
                            <CommentContainer />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default withComponent(memo(InfomationDetailProduct));
