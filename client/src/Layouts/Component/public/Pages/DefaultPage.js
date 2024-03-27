import Footer from '../MainPageLayouts/Footer';
import Header from '../MainPageLayouts/Header';

const DefaultPage = ({ children }) => {
    return (
        <div className="flex flex-col h-screen overflow-y-scroll overflow-x-hidden">
            <Header />
            {children}
            <Footer />
        </div>
    );
};

export default DefaultPage;
