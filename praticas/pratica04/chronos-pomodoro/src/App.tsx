import { Home } from './pages/Homes';
import { useState } from 'react';
import type { TaskStateModel } from './models/TaskStateModel';

import './styles/theme.css';
import './styles/global.css';

// 1. Definimos o valor inicial da nossa aplicação
const initialState: TaskStateModel = {
  tasks: [],
  secondsRemaining: 0,
  formattedSecondsRemaining: '00:00',
  activeTask: null,
  currentCycle: 0,
  config: {
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
  },
};

export function App() {
  // 2. Iniciamos o estado global
  const [state, setState] = useState(initialState);

  // 3. Repassamos o estado e a função que altera o estado para o componente filho
  return <Home state={state} setState={setState} />;
}