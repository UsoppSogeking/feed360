import { Link } from "react-router-dom"
import useDashboardData from "../hooks/useDashboardData ";
import useFirestoreUser from "../hooks/useFirestoreUser";
import useFeedbackRequest from "../hooks/useFeedbackRequest";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Home = () => {
    const { user } = useAuth();
    const { markAsRead, markResponseAsRead } = useFeedbackRequest();
    const { firestoreUser, loading: userLoading, error: userError } = useFirestoreUser(user?.uid);
    const { data, loading, error } = useDashboardData(firestoreUser?.email);
    const navigate = useNavigate();

    if (userLoading) return <div>Carregando...</div>;
    if (userError) return <div>Erro: {userError}</div>;
    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    const {
        recentRequests,
        recentResponses,
        pendingFeedbacks,
        completedFeedbacks,
    } = data;

    const handleItemClick = async (id) => {
        try {
            await markAsRead(id);
        } catch (error) {
            console.error('Error marking request as read:', error);
        }
    };

    const handleResponseClick = async (responseId) => {
        try {
            await markResponseAsRead(responseId);
        } catch (error) {
            console.error('Error marking response as read:', error);
        }
    };

    const newFeedback = () => {
        navigate('/feedback');
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 sm:py-12">
            <div className="max-w-4xl mx-auto sm:w-full sm:max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h2 className="text-lg font-medium mb-2 text-gray-900">Solicitações Pendentes</h2>
                        <ul role="list" className="divide-y divide-gray-100">
                            {pendingFeedbacks.length > 0 ? (
                                pendingFeedbacks.map(request => (
                                    <Link to={`/feedbackdetail/${request.id}`} key={request.id} className="flex justify-between gap-x-6 py-5" onClick={() => handleItemClick(request.id)}>
                                        <div className="flex min-w-0 gap-x-4">
                                            <img src={`${request?.formData?.photoUrl}`} alt="" className="h-12 w-12 flex-none rounded-full bg-gray-50" />
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">{request?.formData?.userName}</p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{request?.formData?.userEmail}</p>
                                            </div>
                                        </div>
                                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                            <p className="text-sm leading-6 text-gray-900">{request?.formData?.title}</p>
                                            <p className="mt-1 text-xs leading-5 text-gray-500">{formatDistanceToNow(request?.formData?.timestamp?.toDate(), { addSuffix: true, locale: ptBR })}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">Não há solicitações pendentes.</p>
                            )}
                        </ul>
                    </div>

                    {/* Card de Respostas Pendentes */}
                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h2 className="text-lg font-medium mb-2 text-gray-900">Respostas Pendentes</h2>
                        <ul role="list" className="divide-y divide-gray-100">
                            {completedFeedbacks.length > 0 ? (
                                completedFeedbacks.map(response => (
                                    <Link to={`/responsedetail/${response.data.responseId}`} key={response.id} className="flex justify-between gap-x-6 py-5" onClick={() => handleResponseClick(response.id)}>
                                        <div className="flex min-w-0 gap-x-4">
                                            <img src={`${response?.data?.photoUrl}`} alt="" className="h-12 w-12 flex-none rounded-full bg-gray-50" />
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">{response?.data?.userName}</p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{response?.data?.userEmail}</p>
                                            </div>
                                        </div>
                                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                            <p className="text-sm leading-6 text-gray-900">{response?.data?.requestTitle}</p>
                                            <p className="mt-1 text-xs leading-5 text-gray-500">{formatDistanceToNow(response?.data?.timestamp?.toDate(), { addSuffix: true, locale: ptBR })}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">Não há respostas pendentes.</p>
                            )}
                        </ul>
                    </div>

                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h2 className="text-lg font-medium mb-2 text-gray-900">Solicitações Recentes</h2>
                        <ul role="list" className="divide-y divide-gray-100">
                            {recentRequests.length > 0 ? (
                                recentRequests.map(request => (
                                    <Link to={`/feedbackdetail/${request?.id}`} key={request.id} className="flex justify-between gap-x-6 py-5">
                                        <div className="flex min-w-0 gap-x-4">
                                            <img src={`${request.formData.photoUrl}`} alt="" className="h-12 w-12 flex-none rounded-full bg-gray-50" />
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">{request.formData.userName}</p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{request.formData.userEmail}</p>
                                            </div>
                                        </div>
                                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                            <p className="text-sm leading-6 text-gray-900">{request.formData.title}</p>
                                            <p className="mt-1 text-xs leading-5 text-gray-500">{formatDistanceToNow(request?.formData?.timestamp?.toDate(), { addSuffix: true, locale: ptBR })}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Nenhuma solicitação recente.</p>
                            )}
                        </ul>
                    </div>

                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h2 className="text-lg font-medium mb-2 text-gray-900">Respostas Recentes</h2>
                        <ul role="list" className="divide-y divide-gray-100">
                            {recentResponses.length > 0 ? (
                                recentResponses.map(response => (
                                    <Link to={`/responsedetail/${response.data.responseId}`} key={response.id} className="flex justify-between gap-x-6 py-5">
                                        <div className="flex min-w-0 gap-x-4">
                                            <img src={`${response.data.photoUrl}`} alt="" className="h-12 w-12 flex-none rounded-full bg-gray-50" />
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">{response?.data?.userName}</p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{response?.data?.userEmail}</p>
                                            </div>
                                        </div>
                                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                            <p className="text-sm leading-6 text-gray-900">{response?.data?.requestTitle}</p>
                                            <p className="mt-1 text-xs leading-5 text-gray-500">{formatDistanceToNow(response?.data?.timestamp?.toDate(), { addSuffix: true, locale: ptBR })}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Nenhuma resposta recente.</p>
                            )}
                        </ul>
                    </div>
                </div>
                <button type="button" className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-6" onClick={newFeedback}>
                    Solicitar novo feedback
                </button>
            </div>
        </div>
    );
}

export default Home;