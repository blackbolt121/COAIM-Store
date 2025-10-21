

const SkeletonCard = () => (
    <div className="w-72 h-[28rem] bg-white rounded-lg shadow-md overflow-hidden p-4">
        <div className="bg-gray-200 h-48 w-full rounded-md animate-pulse"></div>
        <div className="mt-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mt-auto animate-pulse"></div>
        </div>
    </div>
);

export default SkeletonCard;