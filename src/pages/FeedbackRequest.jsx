import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import useFeedbackRequest from "../hooks/useFeedbackRequest";
import { Link } from "react-router-dom";
import useFirestoreUser from "../hooks/useFirestoreUser";

import { v4 as uuidv4 } from 'uuid';

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

//components
import StatusMessage from "../components/StatusMessage";
import Spinner from "../components/Spinner";
import { serverTimestamp } from "firebase/firestore";

const FeedbackRequest = () => {
    const { sendFeedbackRequest, feedbackRequests, isError, success, isLoading, feedbackResponses, markAsRead, markResponseAsRead } = useFeedbackRequest();

    const { user, loading } = useAuth();
    
    const { firestoreUser, loading: userLoading } = useFirestoreUser(user?.uid);

    const requestId = uuidv4();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [addressee, setAddressee] = useState("");
    const [selectedTipoPergunta, setSelectedTipoPergunta] = useState('aberta');
    const [tipoPergunta, setTipoPergunta] = useState("aberta");
    const [perguntaAtual, setPerguntaAtual] = useState('');
    const [opcoesResposta, setOpcoesResposta] = useState(['']);
    const [perguntas, setPerguntas] = useState([]);
    const [isCheckedHabilidadesTecnicas, setIsCheckedHabilidadesTecnicas] = useState(false);
    const [isCheckedComportamentais, setIsCheckedComportamentais] = useState(false);
    const [isCheckedLideranca, setIsCheckedLideranca] = useState(false);
    const [isCheckedTrabalho, setIsCheckedTrabalho] = useState(false);
    const [toggleBtn, setToggleBtn] = useState(true);
    const [requestBtn, setRequestBtn] = useState(true);
    const [responsesBtn, setResponsesBtn] = useState(false);
    const [newError, setNewError] = useState(null);

    const handleAddresseeChange = (e) => {
        const value = e.target.value;
        if (value === user?.email) {
            setNewError('Insira um e-mail valido.');
        } else {
            setNewError(null); // Clear the error if the email is valid
        }
        setAddressee(value);
    };

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
            console.log('Response marked as read successfully.');
        } catch (error) {
            console.error('Error marking response as read:', error);
        }
    };

    const handleToggleHabilidadesTecnicas = () => {
        setIsCheckedHabilidadesTecnicas(!isCheckedHabilidadesTecnicas);
    };

    const handleToggleComportamentais = () => {
        setIsCheckedComportamentais(!isCheckedComportamentais);
    };

    const handleToggleLideranca = () => {
        setIsCheckedLideranca(!isCheckedLideranca);
    };

    const handleToggleTrabalho = () => {
        setIsCheckedTrabalho(!isCheckedTrabalho);
    };

    const handleTipoPerguntaChange = (value) => {
        setSelectedTipoPergunta(value); // Atualiza o estado selectedTipoPergunta
        setTipoPergunta(value); // Atualiza o estado tipoPergunta
    };

    const handleOpcaoChange = (e, index) => {
        const novasOpcoes = [...opcoesResposta];
        novasOpcoes[index] = e.target.value;
        setOpcoesResposta(novasOpcoes);
    }

    const adicionarOpcao = () => {
        setOpcoesResposta([...opcoesResposta, '']);
    }

    const adicionarPergunta = () => {
        let novaPergunta = '';
        if (tipoPergunta === "aberta") {
            novaPergunta = perguntaAtual;
        } else if (tipoPergunta === "sim-ou-nao") {
            novaPergunta = perguntaAtual;
        } else if (tipoPergunta === "multipla-escolha") {
            novaPergunta = perguntaAtual;
        }

        setPerguntas([...perguntas, { tipo: tipoPergunta, pergunta: novaPergunta, opcoes: opcoesResposta }]);
        setSelectedTipoPergunta("aberta");
        setOpcoesResposta(['']);
        setPerguntaAtual('');
        setTipoPergunta("aberta")
    }

    const removerPergunta = (index) => {
        const novasPerguntas = [...perguntas];
        novasPerguntas.splice(index, 1);
        setPerguntas(novasPerguntas);
    };

    const generateUniqueId = () => {
        return Math.random().toString(36).substring(2, 9);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            formData: {
                requestId: requestId,
                userName: user && user.displayName ? user.displayName : 'Nome Padrão',
                photoUrl: firestoreUser && firestoreUser.photoUrl ? firestoreUser.photoUrl : 'https://i.pinimg.com/originals/20/c0/0f/20c00f0f135c950096a54b7b465e45cc.jpg',
                userEmail: user && user.email ? user.email : '',
                title,
                description,
                addressee,
                habilidadesTecnicas: isCheckedHabilidadesTecnicas ? isCheckedHabilidadesTecnicas : null,
                competenciasComportamentais: isCheckedComportamentais ? isCheckedComportamentais : null,
                lideranca: isCheckedLideranca ? isCheckedLideranca : null,
                qualidadeTrabalho: isCheckedTrabalho ? isCheckedTrabalho : null,
                readed: false,
                timestamp: serverTimestamp(),
                answered: false
            },
            perguntasData: perguntas.map(pergunta => ({
                id: generateUniqueId(),
                tipo: pergunta.tipo,
                pergunta: pergunta.pergunta,
                opcoesResposta: pergunta.opcoes || [],
            }))
        };


        await sendFeedbackRequest(data);

        setTitle('');
        setDescription('');
        setAddressee('');
        setPerguntaAtual('');
        setOpcoesResposta(['']);
        setPerguntas([]);
        setIsCheckedHabilidadesTecnicas(false);
        setIsCheckedComportamentais(false);
        setIsCheckedLideranca(false);
        setIsCheckedTrabalho(false);
    }

    const toggleBtnFalse = () => {
        setToggleBtn(false);
    }

    const toggleBtnTrue = () => {
        setToggleBtn(true);
    }

    const handleRequestBtn = () => {
        setRequestBtn(true);
        setResponsesBtn(false);
    }

    const handleResponsesBtn = () => {
        setResponsesBtn(true);
        setRequestBtn(false);
    }

    if (loading || userLoading) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <div className="max-w-md mx-auto mt-10">
                <div className="w-full flex justify-center gap-8">
                    <button type="button" className={`${toggleBtn ? 'text-indigo-600 font-medium' : 'text-gray-300'}  text-sm`} onClick={() => toggleBtnTrue()}>Send</button>
                    <button type="button" className={`${!toggleBtn ? 'text-indigo-600 text-sm font-medium' : 'text-gray-300'}`} onClick={() => toggleBtnFalse()}>Received</button>
                </div>
            </div>

            <div className={`${toggleBtn ? 'flex' : 'hidden'}  flex-1 flex-col justify-center min-h-full px-6 pb-4 lg:px-8`}>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Feedback Request
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full  sm:max-w-sm">
                    <form action="#" className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900" >
                                Title
                            </label>
                            <div className="mt-2">
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-inherit outline-none"
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={title || ""}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900" >
                                Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-inherit outline-none"
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description || ""}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="tipo-pergunta" className="block text-sm font-medium text-gray-700">Tipo de Pergunta:</label>
                            <select id="tipo-pergunta" className="mt-1 block w-full pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-inherit" value={selectedTipoPergunta} onChange={(e) => handleTipoPerguntaChange(e.target.value)}>
                                <option value="aberta">Aberta</option>
                                <option value="multipla-escolha">Múltipla Escolha</option>
                                <option value="sim-ou-nao">Sim ou Não</option>
                            </select>
                        </div>
                        <div>
                            <div className="my-2">
                                <input
                                    type="text"
                                    placeholder="Pergunta:"

                                    value={perguntaAtual}
                                    onChange={(e) => setPerguntaAtual(e.target.value)}
                                    className={`block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-inherit outline-none`}
                                />
                            </div>
                            {tipoPergunta === 'multipla-escolha' && (
                                <div className={`mb-4 ${tipoPergunta === "aberta" || tipoPergunta === "sim-ou-nao" ? "hidden" : "block"}`} >
                                    <label htmlFor="opcoes-resposta" className="block text-sm font-medium text-gray-700">Opções de Resposta:</label>
                                    {opcoesResposta.map((opcao, index) => (
                                        <div key={index} className="flex items-center mb-2">
                                            <input type="text" className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-inherit outline-none mr-2" placeholder={`Opção ${index + 1}`} value={opcao} onChange={(e) => handleOpcaoChange(e, index)} />
                                            {index === opcoesResposta.length - 1 && <button className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700" onClick={adicionarOpcao}>+ Adicionar Opção</button>}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button type="button" className="w-full text-start text-sm font-medium text-indigo-600 " onClick={() => adicionarPergunta()}>Adicionar Pergunta</button>
                        </div>
                        <div className="mt-4">
                            <div>
                                <h2 className="text-sm font-medium leading-6 text-gray-900">Preview das Perguntas:</h2>
                                {perguntas.map((pergunta, index) => (
                                    <div key={index} className="flex items-start justify-between mb-2">
                                        <div>
                                            <p>{pergunta.pergunta}</p>
                                            {pergunta.tipo === 'multipla-escolha' && pergunta.opcoes.length > 0 && (
                                                <ul>
                                                    {pergunta.opcoes.map((opcao, opcaoIndex) => (
                                                        <li key={opcaoIndex}>{opcao}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            {pergunta.tipo === 'sim-ou-nao' && (
                                                <div>
                                                    <p>Opções: Sim, Não</p>
                                                </div>
                                            )}
                                        </div>
                                        <button type="button" className="text-red-600 hover:text-red-800" onClick={() => removerPergunta(index)}>X</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <legend className=" text-sm font-medium leading-6 text-gray-900">Rating criteria</legend>
                            <div className="space-y-1">
                                <div className="flex items-center flex-1">
                                    <input type="radio" id="hbtecnicas" checked={isCheckedHabilidadesTecnicas} onChange={handleToggleHabilidadesTecnicas} onClick={handleToggleHabilidadesTecnicas} className="hidden" value="Habilidades técnicas" />
                                    <label htmlFor="hbtecnicas" className="text-sm flex items-center">
                                        <span className={`inline-block w-4 h-4 border border-gray-300 rounded-full mr-2 ${isCheckedHabilidadesTecnicas ? 'bg-indigo-600 border-indigo-600' : 'bg-gray-200 border-gray-300'}`}></span>
                                        Habilidades técnicas
                                    </label>
                                </div>

                                <div className="flex items-center flex-1">
                                    <input type="radio" id="comportamentais" checked={isCheckedComportamentais} onChange={handleToggleComportamentais} onClick={handleToggleComportamentais} className="hidden" value="competências comportamentais" />
                                    <label htmlFor="comportamentais" className="text-sm flex items-center">
                                        <span className={`inline-block w-4 h-4 border border-gray-300 rounded-full mr-2 ${isCheckedComportamentais ? 'bg-indigo-600 border-indigo-600' : 'bg-gray-200 border-gray-300'}`}></span>
                                        competências comportamentais
                                    </label>
                                </div>

                                <div className="flex items-center flex-1">
                                    <input type="radio" id="lideranca" checked={isCheckedLideranca} onChange={handleToggleLideranca} onClick={handleToggleLideranca} className="hidden" value="Liderança" />
                                    <label htmlFor="lideranca" className="text-sm flex items-center">
                                        <span className={`inline-block w-4 h-4 border border-gray-300 rounded-full mr-2 ${isCheckedLideranca ? 'bg-indigo-600 border-indigo-600' : 'bg-gray-200 border-gray-300'}`}></span>
                                        Liderança</label>
                                </div>

                                <div className="flex items-center flex-1">
                                    <input type="radio" id="trabalho" checked={isCheckedTrabalho} onChange={handleToggleTrabalho} onClick={handleToggleTrabalho} className="hidden" value="Qualidade do trabalho" />
                                    <label htmlFor="trabalho" className="text-sm flex items-center">
                                        <span className={`inline-block w-4 h-4 border border-gray-300 rounded-full mr-2 ${isCheckedTrabalho ? 'bg-indigo-600 border-indigo-600' : 'bg-gray-200 border-gray-300'}`}></span>
                                        Qualidade do trabalho</label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="addressee" className="block text-sm font-medium leading-6 text-gray-900" >
                                Addressee
                            </label>
                            <div className="mt-2">
                                <input
                                    id="addressee"
                                    name="addressee"
                                    type="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-inherit outline-none"
                                    onChange={handleAddresseeChange}
                                    value={addressee}
                                />
                            </div>
                            <div className="mt-2">
                                {newError && <StatusMessage message={newError} type={'error'} />}
                            </div>
                        </div>

                        <div>
                            {isError && <StatusMessage message={isError} type={'error'} />}
                            {success && <StatusMessage message={success} type={'success'} />}
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-2"
                            >
                                {isLoading ? <Spinner /> : 'Send'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            <div className={`${!toggleBtn ? 'block' : 'hidden'}  max-w-xl mx-auto`}>
                <div className="w-full flex justify-center gap-8 mt-10">
                    <button type="button" className={`${requestBtn ? 'text-gray-500 font-medium' : 'text-gray-300'} text-sm`} onClick={() => handleRequestBtn()}>Requests</button>
                    <button type="button" className={`${responsesBtn ? 'text-gray-500 font-medium' : 'text-gray-300'} text-sm`} onClick={() => handleResponsesBtn()} >Responses</button>
                </div>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="my-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        {requestBtn ? "Requests received" : "Responses received"}
                    </h2>
                </div>
                <ul role="list" className={`${requestBtn ? 'block' : 'hidden'} divide-y divide-gray-100 pl-4`}>
                    {feedbackRequests.length === 0 ? <p className="flex justify-center mt-5">não há solicitações</p> : feedbackRequests.map((feed, index) => {
                        return (
                            <Link to={`/feedbackdetail/${feed.id}`} className={`${feed.formData.readed ? 'bg-gray-100' : 'bg-inherit'} flex justify-between gap-x-6 py-5`} key={index} onClick={() => handleItemClick(feed.id)}>
                                <div className="flex min-w-0 gap-x-4" >
                                    <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={feed?.formData?.photoUrl} alt="" />
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">{feed?.formData?.userName}</p>
                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{feed?.formData?.userEmail}</p>
                                    </div>
                                </div>
                                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                    <p className="text-sm leading-6 text-gray-900">{feed?.formData?.title}</p>
                                    <p className="mt-1 text-xs leading-5 text-gray-500">{formatDistanceToNow(feed?.formData?.timestamp?.toDate(), { addSuffix: true, locale: ptBR })}</p>
                                </div>
                            </Link>
                        )
                    })}
                    {/* <li className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                            <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">Leslie Alexander</p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">leslie.alexander@example.com</p>
                            </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900">Co-Founder / CEO</p>
                            <p className="mt-1 text-xs leading-5 text-gray-500">Last seen <time dateTime="2023-01-23T13:23Z">3h ago</time></p>
                        </div>
                    </li>
                    <li className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                            <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">Michael Foster</p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">michael.foster@example.com</p>
                            </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900">Co-Founder / CTO</p>
                            <p className="mt-1 text-xs leading-5 text-gray-500">Last seen <time dateTime="2023-01-23T13:23Z">3h ago</time></p>
                        </div>
                    </li>
                    <li className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                            <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">Dries Vincent</p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">dries.vincent@example.com</p>
                            </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900">Business Relations</p>
                            <div className="mt-1 flex items-center gap-x-1.5">
                                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                </div>
                                <p className="text-xs leading-5 text-gray-500">Online</p>
                            </div>
                        </div>
                    </li>
                    <li className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                            <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">Lindsay Walton</p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">lindsay.walton@example.com</p>
                            </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900">Front-end Developer</p>
                            <p className="mt-1 text-xs leading-5 text-gray-500">Last seen <time dateTime="2023-01-23T13:23Z">3h ago</time></p>
                        </div>
                    </li>
                    <li className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                            <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">Courtney Henry</p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">courtney.henry@example.com</p>
                            </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900">Designer</p>
                            <p className="mt-1 text-xs leading-5 text-gray-500">Last seen <time dateTime="2023-01-23T13:23Z">3h ago</time></p>
                        </div>
                    </li>
                    <li className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                            <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">Tom Cook</p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">tom.cook@example.com</p>
                            </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900">Director of Product</p>
                            <div className="mt-1 flex items-center gap-x-1.5">
                                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                </div>
                                <p className="text-xs leading-5 text-gray-500">Online</p>
                            </div>
                        </div>
                    </li> */}
                </ul>

                <ul role="list" className={`${responsesBtn ? 'block' : 'hidden'} divide-y divide-gray-100 pl-4`}>
                    {feedbackResponses.length === 0 ? <p className="flex justify-center mt-5">Não há respostas a serem exibidas</p> : feedbackResponses.map((response, index) => {
                        return (
                            <Link to={`/responsedetail/${response?.data?.responseId}`} className={`${response.data.readed ? 'bg-gray-100' : 'bg-inherit'} flex justify-between gap-x-6 py-5`} key={index} onClick={() => handleResponseClick(response.id)} >
                                <div className="flex min-w-0 gap-x-4">
                                    <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={response?.data?.photoUrl} alt="" />
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
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default FeedbackRequest