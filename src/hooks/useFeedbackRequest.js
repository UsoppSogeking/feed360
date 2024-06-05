import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from '../hooks/useAuth';

const useFeedbackRequest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [feedbackRequests, setFeedbackRequests] = useState([]);
    const [feedbackResponses, setFeedbackResponses] = useState([]);

    const { user } = useAuth();

    const sendFeedbackRequest = async (data) => {
        setIsLoading(true);
        try {
            // Cria um novo documento na coleção "solicitacoes" no Firestore
            const docRef = await addDoc(collection(db, 'solicitacoes'), data);

            // Atualiza o formData com o ID gerado pelo Firebase
            const updatedFormData = {
                ...data.formData,
                firebaseDocId: docRef.id
            };

            // Cria um novo objeto de dados com o formData atualizado
            const updatedData = {
                formData: updatedFormData,
                perguntasData: data.perguntasData
            };

            // Atualiza o documento com o ID gerado pelo Firebase
            await updateDoc(doc(db, 'solicitacoes', docRef.id), updatedData);

            setSuccess("Solicitação de feedback enviada com sucesso!");
            console.log('Documento criado com ID:', docRef.id);
            setTimeout(() => setSuccess(null), 2000);
        } catch (error) {
            setIsError(error.message);
            console.error('Erro ao criar documento:', error);
            setTimeout(() => setIsError(null), 2000);
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        {/*Hook para recupear e listar as solicitações com base no email do destinatário */ }
        if (user) {
            const fetchFeedbackRequest = async () => {
                setIsLoading(true);
                try {
                    const q = query(collection(db, 'solicitacoes'), where('formData.addressee', '==', user.email));
                    const querySnapchot = await getDocs(q);
                    const fetchedFeedbackRequests = [];
                    querySnapchot.forEach((doc) => {
                        const data = doc.data();//obtém os dados do documento
                        fetchedFeedbackRequests.push({ id: doc.id, ...data });
                    });
                    setFeedbackRequests(fetchedFeedbackRequests);
                } catch (error) {
                    console.error(error)
                } finally {
                    setIsLoading(false);
                }
            };
            fetchFeedbackRequest();
        }
    }, [user]);

    const sendFeedbackRequestResponse = async (data) => {
        {/*Hook para enviar as respostas das solicitação de feedback */ }
        setIsLoading(true);
        try {
            const docRef = await addDoc(collection(db, 'responses'), data);
            setSuccess("feedback enviado com sucesso!");
            console.log('Documento criado com o ID:', docRef.id);
            setTimeout(() => setSuccess(null), 2000);
        } catch (error) {
            setIsError(error.message);
            console.error('Erro ao criar documento:', error);
            setTimeout(() => setIsError(null), 2000);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        {/*Hook para buscar e listar as respostas com base no email do remetente da solicitação, que vira o destinatário da resposta */ }
        if (user) {
            const fetchFeedbackRequestResponses = async () => {
                setIsLoading(true);
                try {
                    const q = query(collection(db, 'responses'), where('data.destinatario', '==', user.email));
                    const querySnapshot = await getDocs(q);
                    const fetchedFeedbackRequestsResponses = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();//obtém os dados do documento
                        fetchedFeedbackRequestsResponses.push({ id: doc.id, ...data });
                    });
                    setFeedbackResponses(fetchedFeedbackRequestsResponses);
                } catch (error) {
                    console.error(error);
                    setIsError(error.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchFeedbackRequestResponses();
        }
    }, [user]);

    const markAsRead = async (documentId) => {
        try {
            const requestDocRef = doc(db, 'solicitacoes', documentId);
            await updateDoc(requestDocRef, {
                'formData.readed': true
            });
            setSuccess(true);
        } catch (error) {
            console.error('Error marking request as read:', error);
            setIsError(true);
        }
    };

    const markResponseAsRead = async (responseId) => {
        try {
            const responseDocRef = doc(db, 'responses', responseId);
            await updateDoc(responseDocRef, {
                'data.readed': true
            });
        } catch (error) {
            console.error('Error marking response as read:', error);
            throw new Error('Error marking response as read');
        }
    };

    const markAnsweredTruth = async (documentId) => {
        try {
            if (!documentId) {
                console.error('Error marking answered as truth: Document ID is missing');
                setIsError(true);
                return;
            }

            const requestDocRef = doc(db, 'solicitacoes', documentId);
            await updateDoc(requestDocRef, {
                'formData.answered': true
            });
            setSuccess(true);
        } catch (error) {
            console.error('Error marking answered as truth:', error);
            setIsError(true);
        }
    }


    return { sendFeedbackRequest, isLoading, feedbackRequests, sendFeedbackRequestResponse, isError, success, feedbackResponses, markAsRead, markResponseAsRead, markAnsweredTruth };
}



export default useFeedbackRequest;