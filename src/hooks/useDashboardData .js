import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

const useDashboardData = (userEmail) => {
    const [data, setData] = useState({
        recentRequests: [],
        recentResponses: [],
        pendingFeedbacks: [],
        completedFeedbacks: [],
        statistics: {},
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuth();

    // Obtém a data atual
    const currentDate = new Date();

    // Define o cutoffTimestamp para uma semana atrás
    const cutoffTimestamp = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 dias em milissegundos

    useEffect(() => {
        if (!userEmail) {
            setLoading(false);
            setError('User email is not provided');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch pending requests (unread)
                const pendingRequestsQuery = query(
                    collection(db, 'solicitacoes'),
                    where('formData.addressee', '==', userEmail),
                    where('formData.readed', '==', false)
                );
                const pendingRequestsSnapshot = await getDocs(pendingRequestsQuery);
                const pendingRequests = pendingRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Fetch pending responses (unread)
                const pendingResponsesQuery = query(
                    collection(db, 'responses'),
                    where('data.destinatario', '==', userEmail),
                    where('data.readed', '==', false)
                );
                const pendingResponsesSnapshot = await getDocs(pendingResponsesQuery);
                const pendingResponses = pendingResponsesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Fetch recent requests (sent)
                const recentRequestsQuery = query(
                    collection(db, 'solicitacoes'),
                    where('formData.addressee', '==', user.email),
                    orderBy('formData.timestamp', 'desc'),
                    limit(5)
                );
                const recentRequestsSnapshot = await getDocs(recentRequestsQuery);
                const recentRequests = recentRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Fetch recent responses (received)
                const recentResponsesQuery = query(
                    collection(db, 'responses'),
                    where('data.timestamp', '>', cutoffTimestamp),
                    orderBy('data.timestamp', 'desc'),
                    limit(5)
                );
                const recentResponsesSnapshot = await getDocs(recentResponsesQuery);
                const recentResponses = recentResponsesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setData({
                    recentRequests,
                    recentResponses,
                    pendingFeedbacks: pendingRequests,
                    completedFeedbacks: pendingResponses,
                    statistics: {}, // Update with actual data if needed
                });
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userEmail]);

    return { data, loading, error };
};

export default useDashboardData;
