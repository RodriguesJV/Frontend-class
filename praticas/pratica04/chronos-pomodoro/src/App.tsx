import { TaskContextProvider } from './contexts/TaskContext/TaskContextProvider';
import { MessagesContainer } from './components/MessagesContainer';
import { MainRouter } from './routers/MainRouter';
import { AuthContextProvider } from './contexts/AuthContext'; // Adicionado o import do AuthContext
import './styles/theme.css';
import './styles/global.css';

export function App() {
  return (
    <AuthContextProvider>
      <TaskContextProvider>
        <MessagesContainer>
          <MainRouter />
        </MessagesContainer>
      </TaskContextProvider>
    </AuthContextProvider>
  );
}