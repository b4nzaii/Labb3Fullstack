import PostList from '../components/PostList'
import Sidebar from '../components/Sidebar'

const HomePage = () => {
    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            <div className="bg-light border-end" style={{ width: '250px' }}>
                <Sidebar />
            </div>
            <div className="flex-grow-1 p-4">
                <h2>FYP</h2> {/* For you Page */}
                <PostList />
            </div>
        </div>
    );
};

export default HomePage;