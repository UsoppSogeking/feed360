import '../index.css';

const Spinner = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="w-5 h-5 border-4 border-t-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin"></div>
        </div>
    );
};

export default Spinner