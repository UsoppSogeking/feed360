# Feed360

Feed360 é um aplicativo/site desenvolvido para facilitar o processo de solicitação e recebimento de feedbacks. Usuários podem solicitar feedback de outros usuários, configurando perguntas específicas e critérios de avaliação. Esse projeto foi criado com o intuito de valorizar a importância do feedback no desenvolvimento profissional, especialmente para iniciantes que buscam melhorar suas habilidades e desempenho.

## Funcionalidades

- **Solicitação de Feedback**: Usuários podem solicitar feedback de outros usuários fornecendo o e-mail do destinatário, um título, uma descrição e criando perguntas.
  - **Tipos de Perguntas**:
    - **Perguntas Abertas**: O destinatário pode fornecer respostas detalhadas.
    - **Múltipla Escolha**: Usuário pode adicionar várias opções de resposta.
    - **Sim ou Não**: O destinatário escolhe entre duas opções, sim ou não.
  - **Critérios de Avaliação**: Usuário pode selecionar critérios como qualidade de trabalho, liderança, etc.
  
- **Listagem de Solicitações**: As solicitações ficam listadas na página "feed". Clicar em uma solicitação marca-a como lida.
  
- **Restrições de Resposta**:
  - As solicitações podem ser respondidas apenas uma vez.
  - A solicitação só pode ser respondida por terceiros (não pelo próprio solicitante).
  
- **Página Inicial**:
  - Exibe listagens de solicitações e respostas pendentes para fácil acesso.
  - Mostra todas as solicitações e respostas recentes.

## Motivação

O objetivo de criar Feed360 é destacar a importância do feedback no crescimento profissional. Feedbacks são ferramentas poderosas, especialmente para iniciantes que precisam de orientação e críticas construtivas para progredir em suas carreiras. Este aplicativo/site permite que superiores, colegas ou mentores forneçam feedback detalhado e eficaz, mesmo com agendas ocupadas. Além disso, encoraja iniciantes e estagiários a buscar ativamente feedback, demonstrando seu interesse em crescer e melhorar.

## Tecnologias Utilizadas

- **Frontend**:
  - React
  - Tailwind CSS
  - React Router DOM

- **Backend/API**:
  - Firebase Firestore (para armazenamento e gerenciamento de dados)
  - Formspree (para envio de formulários de contato)

## Como Rodar o Projeto

### Pré-requisitos

- Node.js instalado
- Conta no GitHub
- Conta na Firebase
- Conta na Vercel (opcional, para deploy)

### Passos

1. **Clone o Repositório**:
    ```bash
    git clone https://github.com/usuario/feed360.git
    cd feed360
    ```

2. **Instale as Dependências**:
    ```bash
    npm install
    ```

3. **Configure o Firebase**:
    - Crie um projeto no [Firebase](https://firebase.google.com/).
    - Habilite o Firestore Database e obtenha as configurações do seu projeto.
    - Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
      ```
      REACT_APP_FIREBASE_API_KEY=your_api_key
      REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
      REACT_APP_FIREBASE_PROJECT_ID=your_project_id
      REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
      REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
      REACT_APP_FIREBASE_APP_ID=your_app_id
      ```

4. **Inicie o Servidor de Desenvolvimento**:
    ```bash
    npm run dev
    ```

5. **Build para Produção**:
    ```bash
    npm run build
    ```

### Deploy na Vercel

1. **Conecte seu Repositório GitHub**:
    - Acesse a Vercel e conecte seu repositório GitHub.

2. **Configure o Projeto**:
    - Siga as instruções da Vercel para configurar seu projeto e fazer o deploy.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

1. **Fork o Projeto**
2. **Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)**
3. **Commit suas Modificações (`git commit -m 'Add some AmazingFeature'`)**
4. **Push para a Branch (`git push origin feature/AmazingFeature`)**
5. **Abra um Pull Request**

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
