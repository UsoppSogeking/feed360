import { useParams } from "react-router-dom";
import useFeedbackDetail from "../hooks/useFeedbackDetail ";

const ResponseDetail = () => {

    const { responseId } = useParams();

    const { feedbackDetail, isLoading, isError } = useFeedbackDetail(responseId);

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    if (isError) {
        return <div>Erro: {isError}</div>;
    }

    if (!feedbackDetail) {
        return <div>Nenhum detalhe encontrado.</div>;
    }

    const { response, request } = feedbackDetail;

    const renderResposta = (pergunta) => {
        const resposta = response.responses[pergunta.id];
        if (!resposta) {
            return <p className="text-gray-700">Sem resposta</p>;
        }

        switch (pergunta.tipo) {
            case 'aberta':
                return <p className="text-gray-700">{resposta}</p>;
            case 'multipla-escolha':
                return <p className="text-gray-700">{resposta.join(', ')}</p>;
            case 'sim-ou-nao':
                return <p className="text-gray-700">{resposta}</p>;
            // Adicione mais casos aqui conforme necessário para outros tipos de pergunta
            default:
                return <p className="text-gray-700">Tipo de pergunta não suportado</p>;
        }
    };

    return (
        <div className="flex-1 flex-col justify-center min-h-full px-6 pb-4 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Resposta da solicitação
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full  sm:max-w-sm">

                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        {request.formData.title}
                    </h2>
                </div>

                <div className="mt-5">
                    <span className="block text-sm font-medium leading-6 text-gray-900" >
                        Descrição:
                    </span>
                    <div className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6 bg-inherit">
                        <p className="text-start">{request.formData.description}</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-medium text-gray-700">Critérios de avaliação:</h2>
                    <div className="flex gap-2 flex-wrap">
                        <span className="text-sm text-indigo-400">{request.formData.habilidadesTecnicas ? "Habilidades Técnicas" : null}</span>
                        <span className="text-sm text-indigo-400">{request.formData.lideranca ? "Liderança" : null}</span>
                        <span className="text-sm text-indigo-400">{request.formData.competenciasComportamentais ? "Competências Comportamentais" : null}</span>
                        <span className="text-sm text-indigo-400">{request.formData.qualidadeTrabalho ? "Qualidade do trabalho" : null}</span>
                    </div>
                </div>

                <div className="mt-5">
                    <h2 className="text-sm font-medium text-gray-700">Perguntas e Respostas:</h2>
                    {request.perguntasData && request.perguntasData.length > 0 ? (
                        request.perguntasData.map((pergunta, index) => (
                            <div key={index} className="mt-4">
                                <p className="font-semibold">{pergunta.pergunta}</p>
                                {renderResposta(pergunta)}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-700">Nenhuma pergunta encontrada.</p>
                    )}
                </div>

                <div className="mt-5">
                    <span className="block text-sm font-medium leading-6 text-gray-700" >
                        Destinatário da solicitação:
                    </span>
                    <div>
                        <span className="block w-full sm:text-sm sm:leading-6 truncate text-xs leading-5 text-gray-500">{response.data.userName}</span>
                        <span className="block w-full sm:text-sm sm:leading-6 truncate text-xs leading-5 text-gray-500">{request.formData.addressee}</span>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default ResponseDetail