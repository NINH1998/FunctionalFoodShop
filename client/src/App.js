import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import i18n from './i18n';
import { PublicPages, AdminPrivatePages, MemberPrivatePages } from 'Router';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { MainPage, PublicPage } from 'Layouts/Component/public/Pages';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from 'Context/Reducer/Category/CategoryApi';
import { AdminLayouts } from 'Layouts/Component/Admin/AdminComponent';
import { MemberLayouts } from 'Layouts/Component/Member/MemberComponent';
import { ToastContainer } from 'react-toastify';
import { getCurrentUser } from 'Context/Reducer/User/UserApi';
import DefaultPage from 'Layouts/Component/public/Pages/DefaultPage';
import path from 'Router/path';

function App() {
    const dispatch = useDispatch();
    const { updateCurrent } = useSelector((state) => state.userReducer);
    const { tokenGoogle } = useSelector((state) => state.googleLoginReducer);
    const { uploadCategory } = useSelector((state) => state.categoriesReducer);

    let userToken = localStorage.getItem('user');
    userToken = JSON.parse(userToken);

    useEffect(() => {
        if (userToken || tokenGoogle) {
            dispatch(getCurrentUser());
        }
        // eslint-disable-next-line
    }, [userToken, tokenGoogle, updateCurrent]);

    useEffect(() => {
        dispatch(getCategories());
        // eslint-disable-next-line
    }, [uploadCategory]);

    return (
        <div className="min-h-screen">
            <Router>
                <Routes>
                    <Route path={path.PUBLIC} element={<PublicPage />}>
                        {PublicPages.map((route, index) => {
                            const PublicPages = route.component;
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <DefaultPage>
                                            <PublicPages />
                                        </DefaultPage>
                                    }
                                />
                            );
                        })}
                    </Route>
                    <Route path={path.ADMIN} element={<AdminLayouts />}>
                        {AdminPrivatePages.map((route, index) => {
                            const PrivatyPage = route.component;
                            return <Route key={index} path={route.path} element={<PrivatyPage />} />;
                        })}
                    </Route>
                    <Route path={path.MEMBER} element={<MemberLayouts />}>
                        {MemberPrivatePages.map((route, index) => {
                            const PrivatyPage = route.component;
                            return <Route key={index} path={route.path} element={<PrivatyPage />} />;
                        })}
                    </Route>
                    <Route
                        path={path.ALL}
                        element={
                            <DefaultPage>
                                <MainPage />
                            </DefaultPage>
                        }
                    />
                </Routes>
            </Router>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

export default App;
