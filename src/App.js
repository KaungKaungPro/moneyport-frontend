import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./UserAccount/Login";
import TradeDashboard from "./VirtualTradingEnv/TradeDashboard";
import ViewStockTrade from "./VirtualTradingEnv/ViewStockTrade";
import ForumLayout from "./Forum/ForumLayout";
import PortfolioDashboard from "./VirtualTradingEnv/PortfolioDashboard";
import { VTELayout } from "./VirtualTradingEnv/VTELayout";
import GameDayTradeInstructions from "./VirtualTradingEnv/GameDayTradeInstructions";
import CreateAccountForm from "./UserAccount/CreateAccountForm";
import Questionnaire from "./RiskAssessment/Questionnaire";
import Recommendations from "./RiskAssessment/Recommendations";
import Terminology from "./LearningCentre/Terminology";
import Question from "./LearningCentre/Question";
import Forum from "./LearningCentre/Forum";
import Scoreboard from "./VirtualTradingEnv/Scoreboard";
import StockPrediction from "./PredictionGame/StockPrediction";
import GamePlay from "./PredictionGame/GamePlay";
import PostDetail from "./Forum/PostDetail";
import ProtectedRoute from "./UserAccount/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import { AuthProvider, useAuth } from "./UserAccount/AuthContext";
import ForumPage from "./Forum/Post";
import GameScore from "./VirtualTradingEnv/VtComponents/GameScore";
import StartVT from "./VirtualTradingEnv/StartVT";

function AuthWrapper({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: window.location.pathname }} />;
}

function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="learningCentre" element={<Terminology />} />
            <Route path="terminology" element={<Terminology />} />
            <Route path="login" element={<Login />} />
            <Route path="createAccount" element={<CreateAccountForm />} />
            <Route path="app" element={<AuthWrapper><AppLayout /></AuthWrapper>}>
              <Route path="questionnaire/:userId" element={<Questionnaire />} />
              <Route path="recommendations/:userId" element={<Recommendations />} />
              <Route path="pg" element={<StockPrediction />} />
              <Route path="pg/gamePlay" element={<GamePlay />} />
              <Route path="vte" element={<VTELayout />}>
                <Route index element={<StartVT />} />
                <Route path="dashboard" element={<TradeDashboard />} />
                <Route path="ti" element={<GameDayTradeInstructions />} />
                <Route path="viewStockTrade/:stockCode" element={<ViewStockTrade />} />
                <Route path="sb" element={<Scoreboard />} />
                <Route path="portfolios" element={<PortfolioDashboard />} />
                <Route path="gameScore/:gameSign" element={<GameScore />} />
              </Route>
              <Route path="forum" element={<ForumLayout />}>
                <Route path="forum" index element={<ForumPage />} />
                <Route path="termQuestions" element={<Forum />} />
                <Route path="post/:postId" element={<PostDetail />} />
                <Route path="question/:questionId" element={<Question />} />
                <Route path="question" element={<Question />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}

export default App;