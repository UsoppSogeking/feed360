import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const useFeedbackDetail = (responseId) => {
    const [feedbackDetail, setFeedbackDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);

    useEffect(() => {
        const fetchFeedbackDetail = async () => {
            setIsLoading(true);
            try {
                console.log("Buscando detalhes do feedback para o responseId:", responseId);

                // Primeiro, obter a resposta específica da coleção 'responses'
                const responseQuery = query(
                    collection(db, 'responses'),
                    where('data.responseId', '==', responseId)
                );
                const responseSnapshot = await getDocs(responseQuery);

                if (responseSnapshot.empty) {
                    console.log("Nenhum documento encontrado em 'responses' com responseId:", responseId);
                    setIsError('Nenhum documento encontrado');
                    setIsLoading(false);
                    return;
                }

                const responseData = responseSnapshot.docs[0].data();

                // Agora, obter a solicitação correspondente da coleção 'solicitacoes' usando o requestId
                const requestId = responseData.data.responseId; // Aqui estamos acessando corretamente o responseId

                const requestQuery = query(
                    collection(db, 'solicitacoes'),
                    where('formData.requestId', '==', requestId)
                );
                const requestSnapshot = await getDocs(requestQuery);

                if (requestSnapshot.empty) {
                    console.log("Nenhum documento encontrado em 'solicitacoes' com requestId:", requestId);
                    setIsError('Nenhum documento encontrado');
                    setIsLoading(false);
                    return;
                }

                const requestData = requestSnapshot.docs[0].data();

                // Definir os dados combinados no estado feedbackDetail
                setFeedbackDetail({
                    response: responseData,
                    request: requestData
                });

            } catch (error) {
                console.error("Erro ao buscar detalhes do feedback:", error);
                setIsError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (responseId) {
            fetchFeedbackDetail();
        }
    }, [responseId]);

    return { feedbackDetail, isLoading, isError };
};

export default useFeedbackDetail;
