import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const withComponent = (Component) => (props) => {
    const { current, currentCart } = useSelector((state) => state.userReducer);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    return (
        <Component
            {...props}
            currentCart={currentCart}
            useSelector={useSelector}
            navigate={navigate}
            current={current}
            dispatch={dispatch}
            location={location}
        />
    );
};

export default withComponent;
