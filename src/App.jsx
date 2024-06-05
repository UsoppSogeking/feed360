import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

//componentes
import Navigation from "./components/Navigation";

//pages
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home";
import FeedbackRequest from "./pages/FeedbackRequest";
import FeedbackRequestDetail from "./pages/FeedbackRequestDetail";
import ResponseDetail from "./pages/ResponseDetail";
import UserProfile from "./pages/UserProfile";

function App() {

  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route exact path="/" element={user ? <Home /> : <Navigate to='/login' />} />
          <Route path="/feedback" element={user ? <FeedbackRequest /> : <Navigate to='/login' />} />
          <Route path="/feedbackdetail/:id" element={user ? <FeedbackRequestDetail /> : <Navigate to='/login' />} />
          <Route path="/responsedetail/:responseId" element={user ? <ResponseDetail /> : <Navigate to='/login' />} />
          <Route path="/profile/:uid" element={user ? <UserProfile /> : <Navigate to='/login' />} />
          <Route path="/register" element={user ? <Navigate to='/' /> : <Register />} />
          <Route path="/login" element={user ? <Navigate to='/' /> : <Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
