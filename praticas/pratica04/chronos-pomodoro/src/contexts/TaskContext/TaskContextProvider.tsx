import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './TaskActions';
import { loadBeep } from '../../utils/loadBeep';
import type { TaskStateModel } from '../../models/TaskStateModel';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState, () => {
    const storageState = localStorage.getItem('state');

    if (storageState === null) return initialTaskState;

    const parsedStorageState = JSON.parse(storageState) as TaskStateModel;

    return {
      ...parsedStorageState,
      activeTask: null,
      secondsRemaining: 0,
      formattedSecondsRemaining: '00:00',
    };
  });

  const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);

  const worker = TimerWorkerManager.getInstance();

  // 1. Escuta as mensagens que vêm do Worker (diminuindo o tempo)
  useEffect(() => {
    worker.onmessage(e => {
      const countDownSeconds = e.data;

      if (countDownSeconds <= 0) {
        if (playBeepRef.current) {
          playBeepRef.current();
          playBeepRef.current = null;
        }
        dispatch({
          type: TaskActionTypes.COMPLETE_TASK,
        });
        worker.terminate();
      } else {
        dispatch({
          type: TaskActionTypes.COUNT_DOWN,
          payload: { secondsRemaining: countDownSeconds },
        });
      }
    });
  }, [worker]);

  // 2. CORREÇÃO AQUI: Controla as ações do Worker (Iniciar / Parar)
  // Só vai rodar quando você clicar para começar ou parar uma tarefa.
  useEffect(() => {
    if (!state.activeTask) {
      worker.terminate();
    } else {
      // Passa apenas as informações necessárias para o Worker começar a contagem
      worker.postMessage({
        activeTask: state.activeTask,
        secondsRemaining: state.secondsRemaining,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worker, state.activeTask]); // Removemos o 'state' inteiro daqui

  // 3. Cuida apenas da parte visual e salvamento no LocalStorage
  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));
    document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`;
  }, [state]);

  // 4. Gerencia o som do Beep
  useEffect(() => {
    if (state.activeTask && playBeepRef.current === null) {
      playBeepRef.current = loadBeep();
    } else if (!state.activeTask) {
      playBeepRef.current = null;
    }
  }, [state.activeTask]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}