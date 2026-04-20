import { createContext, useContext } from 'react';
import type { TaskStateModel } from '../models/TaskStateModel';

// 1. Trazemos o initialState para cá
const initialState: TaskStateModel = {
  tasks: [],
  secondsRemaining: 0,
  formattedSecondsRemaining: '00:00',
  activeTask: null,
  currentCycle: 0,
  config: { workTime: 25, shortBreakTime: 5, longBreakTime: 15 },
};

type TaskContextProps = {
  state: TaskStateModel;
  setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
};

const initialContextValue = {
  state: initialState,
  setState: () => {}, // Função vazia provisória
};

// 2. Criação do Contexto
export const TaskContext = createContext<TaskContextProps>(initialContextValue);

// ==============================================================
// 3. NOSSO COMPONENTE PROVIDER CUSTOMIZADO
// ==============================================================
type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  // O valor passado aqui na prop "value" é o que de fato vai para a aplicação!
  return (
    <TaskContext.Provider value={{ ...initialContextValue }}>
      {children}
    </TaskContext.Provider>
  );
}

// ==============================================================
// 4. NOSSO CUSTOM HOOK (Atalho para os filhos)
// ==============================================================
export function useTaskContext() {
  return useContext(TaskContext);
}