import { useParams } from "react-router-dom";
import useFeedbackRequest from "../hooks/useFeedbackRequest";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import StatusMessage from "../components/StatusMessage";
import Spinner from "../components/Spinner";
import { serverTimestamp } from "firebase/firestore";
import useFirestoreUser from "../hooks/useFirestoreUser";

const FeedbackRequestDetail = () => {
    const [responses, setResponses] = useState({});

    const { user } = useAuth();

    const { firestoreUser, loading: userLoading } = useFirestoreUser(user?.uid);

    const { id } = useParams();

    const { feedbackRequests, sendFeedbackRequestResponse, isLoading, isError, success, markAnsweredTruth } = useFeedbackRequest();

    const selectedFeedbackRequest = feedbackRequests.find(request => request?.id === id);

    if (!selectedFeedbackRequest) {
        return <p>Solicitação não encontrada</p>
    }

    const handleItemClick = async (id) => {
        try {
            await markAnsweredTruth(id);
        } catch (error) {
            console.error('Error marking request as read:', error);
        }
    };

    const { formData, perguntasData } = selectedFeedbackRequest;

    console.log(formData?.firebaseDocId);

    const handleYesOrNoChange = (id, value) => {
        setResponses(prevResponses => ({
            ...prevResponses,
            [id]: value
        }))
    }

    const handleOpenQuestionChange = (id, value) => {
        setResponses(prevResponses => ({
            ...prevResponses,
            [id]: value
        }));
    }

    const handleMultipleChoiceChange = (id, option) => {
        setResponses(prevResponses => {
            const currentOptions = prevResponses[id] || [];
            const updatedOptions = currentOptions.includes(option)
                ? currentOptions.filter(opt => opt != option)
                : [...currentOptions, option];
            return {
                ...prevResponses,
                [id]: updatedOptions
            };
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allQuestionsAnswered = Object.keys(responses).length === perguntasData.length;

        const data = {
            responseId: formData.requestId,
            userName: user && user.displayName ? user.displayName : 'Nome Padrão',
            photoUrl: firestoreUser && firestoreUser.photoUrl ? firestoreUser.photoUrl : 'https://i.pinimg.com/originals/20/c0/0f/20c00f0f135c950096a54b7b465e45cc.jpg',
            userEmail: user && user.email ? user.email : '',
            destinatario: formData?.userEmail,
            requestTitle: formData?.title,
            requestDescription: formData?.description,
            habilidadesTecnicas: formData?.habilidadesTecnicas ? "Habilidades Técnicas" : null,
            lideranca: formData?.lideranca ? "Liderança" : null,
            competenciasComportamentais: formData?.competenciasComportamentais ? "Competências Comportamentais" : null,
            qualidadeTrabalho: formData?.qualidadeTrabalho ? "Qualidade do trabalho" : null,
            readed: false,
            timestamp: serverTimestamp(),
        }

        if (allQuestionsAnswered) {
            const formData = { responses, data };

            try {
                await sendFeedbackRequestResponse(formData);
                setResponses({});
            } catch (error) {
                console.error(error);
            }
        }
    }

    console.log(feedbackRequests[0]?.id)

    if (isLoading || userLoading) return <div>Carregando...</div>

    return (
        <div className={`flex-1 flex-col justify-center min-h-full px-6 pb-4 lg:px-8`}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Feedback Request Detail
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full  sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <h1 className="text-2xl text-center font-bold text-gray-900">{formData.title}</h1>
                    </div>

                    <div>
                        <span className="block text-sm font-medium leading-6 text-gray-900" >
                            Descrição:
                        </span>
                        <div className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6 bg-inherit">
                            <p className="text-start">{formData.description}</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-medium text-gray-700">Critérios de avaliação:</h2>
                        <div className="flex gap-2 flex-wrap">
                            <span className="text-sm text-indigo-400">{formData.habilidadesTecnicas ? "Habilidades Técnicas" : null}</span>
                            <span className="text-sm text-indigo-400">{formData.lideranca ? "Liderança" : null}</span>
                            <span className="text-sm text-indigo-400">{formData.competenciasComportamentais ? "Competências Comportamentais" : null}</span>
                            <span className="text-sm text-indigo-400">{formData.qualidadeTrabalho ? "Qualidade do trabalho" : null}</span>
                        </div>
                    </div>

                    {perguntasData.map((pergunta, index) => {
                        {/*Aberta*/ }
                        if (pergunta.tipo === "aberta") {
                            return (
                                <div className="mb-4" key={index}>
                                    <span className="block text-sm font-medium text-gray-700">Tipo de Pergunta:</span>
                                    <span className="text-base sm:text-sm w-full text-indigo-600">{pergunta.tipo}</span>
                                    <div className="w-full">
                                        <h2 className="text-sm">{pergunta.pergunta}</h2>
                                        <div className="my-2">
                                            <input
                                                type="text"
                                                placeholder="Resposta:"
                                                className={`block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-inherit outline-none`}
                                                onChange={(e) => handleOpenQuestionChange(pergunta.id, e.target.value)}
                                                value={responses[pergunta.id] || ""}
                                            />
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            )
                        } else {
                            return null; // Se não for do tipo "aberta", retornar null ou um elemento vazio
                        }
                    })}

                    {perguntasData.map((perguntas, index) => {
                        {/*Múltipla escolha*/ }
                        // Verifica se é do tipo "multipla-escolha"
                        if (perguntas.tipo === "multipla-escolha") {
                            return (
                                <div key={index}>
                                    <h2 className="text-sm font-medium text-gray-700">Tipo de Pergunta:</h2>
                                    <span className="text-base sm:text-sm w-full text-indigo-600">{perguntas.tipo}</span>
                                    <div className="w-full">
                                        <h2 className="text-sm">{perguntas.pergunta}</h2>
                                        {perguntas.opcoesResposta.map((opcao, i) => (
                                            <div key={i} className="flex items-center flex-1">
                                                <input type="checkbox" id={`${index}-${i}`} className="hidden" value={opcao} checked={responses[perguntas.id] ? responses[perguntas.id].includes(opcao) : false} onChange={() => handleMultipleChoiceChange(perguntas.id, opcao)} />
                                                <label htmlFor={`${index}-${i}`} className="text-sm ml-1 flex items-center cursor-pointer">
                                                    <span className={`inline-block w-4 h-4 border border-gray-300 rounded-full mr-2 ${responses[perguntas.id] && responses[perguntas.id].includes(opcao) ? 'bg-indigo-600 border-indigo-600' : 'bg-gray-200 border-gray-300'}`}></span>
                                                    {opcao}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <hr />
                                </div>
                            );
                        }
                        return null; // Retorna null para não renderizar nada para os outros tipos de perguntas
                    })}

                    {perguntasData.map((perguntas, index) => {
                        {/*Sim ou não */ }
                        if (perguntas.tipo === "sim-ou-nao") {
                            return (
                                <div className="mb-4" key={index}>
                                    <span className="block text-sm font-medium text-gray-700">Tipo de Pergunta:</span>
                                    <span className="text-base sm:text-sm w-full text-indigo-600">{perguntas.tipo}</span>
                                    <div className="w-full">
                                        <h2 className="text-sm">{perguntas.pergunta}</h2>
                                        <div className="mt-1">
                                            <div className="flex items-center flex-1">
                                                <input type="radio" id={`${perguntas.id}-sim`} name={`${perguntas.id}`} className="hidden" value="sim" checked={responses[perguntas.id] === "Sim"} onChange={() => handleYesOrNoChange(perguntas.id, "Sim")} />
                                                <label htmlFor={`${perguntas.id}-sim`} className="text-sm flex items-center">
                                                    <span className={`inline-block w-4 h-4 border border-gray-300 rounded-full mr-2 ${responses[perguntas.id] === "Sim" ? 'bg-indigo-600 border-indigo-600' : 'bg-gray-200 border-gray-300'}`}></span>
                                                    Sim</label>
                                            </div>

                                            <div className="flex items-center flex-1">
                                                <input type="radio" id={`${perguntas.id}-nao`} name={`${perguntas.id}`} className="hidden" value="nao" checked={responses[perguntas.id] === "Não"} onChange={() => handleYesOrNoChange(perguntas.id, "Não")} />
                                                <label htmlFor={`${perguntas.id}-nao`} className="text-sm flex items-center">
                                                    <span className={`inline-block w-4 h-4 border border-gray-300 rounded-full mr-2 ${responses[perguntas.id] === "Não" ? 'bg-indigo-600 border-indigo-600' : 'bg-gray-200 border-gray-300'}`}></span>
                                                    Não</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })}
                    <div>
                        <span className="block text-sm font-medium leading-6 text-gray-700" >
                            Remetente:
                        </span>
                        <div>
                            <span className="block w-full sm:text-sm sm:leading-6 truncate text-xs leading-5 text-gray-500">{formData.userName}</span>
                            <span className="block w-full sm:text-sm sm:leading-6 truncate text-xs leading-5 text-gray-500">{formData.userEmail}</span>
                        </div>
                    </div>

                    <div>
                        {isError && <StatusMessage message={isError} type={'error'} />}
                        {success && <StatusMessage message={success} type={'success'} />}
                        {formData.answered ? (
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-300 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 mt-4"
                                disabled
                            >
                                Solicitação respondida!
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4"
                                onClick={() => handleItemClick(formData?.firebaseDocId)}
                            >
                                {isLoading ? <Spinner /> : 'Send'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FeedbackRequestDetail