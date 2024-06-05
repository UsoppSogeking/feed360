const StatusMessage = ({ message, type }) => {
    if (!message) return null;

    const messageStyles = type === 'success'
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-700';

    return (
        <div className={`p-4 rounded-md ${messageStyles}`}>
            {message}
        </div>
    );
}

export default StatusMessage;