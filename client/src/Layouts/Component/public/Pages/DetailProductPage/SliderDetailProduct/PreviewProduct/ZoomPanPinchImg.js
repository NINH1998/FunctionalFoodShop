import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import withComponent from 'Hocs/withComponent';
import MenuPreviewBtn from './MenuPreviewBtn';

const ZoomPanImage = ({ children }) => {
    return (
        <TransformWrapper initialScale={1}>
            {(utils) => (
                <div className="max-w-screen mx-auto max-h-[573px] flex flex-col items-center justify-center">
                    <MenuPreviewBtn {...utils} />
                    <TransformComponent>{children}</TransformComponent>
                </div>
            )}
        </TransformWrapper>
    );
};

export default withComponent(ZoomPanImage);
