import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './TaskActions';
import { loadBeep } from '../../utils/loadBeep';
import type { TaskStateModel } from '../../models/TaskStateModel';
import { settingsService } from '../../services/settingsService';
import { tasksService } from '../../services/tasksService'; // 👈 novo

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

  // Carrega settings da API no startup
  useEffect(() => {
    settingsService.get().then(settings => {
      dispatch({
        type: TaskActionTypes.CHANGE_SETTINGS,
        payload: {
          workTime: settings.workTime,
          shortBreakTime: settings.shortBreakTime,
          longBreakTime: settings.longBreakTime,
        },
      });
    }).catch(() => {
      console.warn('Não foi possível carregar settings da API');
    });
  }, []);

  // Escuta as mensagens do Worker
  useEffect(() => {
    worker.onmessage(e => {
      const countDownSeconds = e.data;
      if (countDownSeconds <= 0) {
        if (playBeepRef.current) {
          playBeepRef.current();
          playBeepRef.current = null;
        }
        // Completa a task na API
        if (state.activeTask) {
          tasksService.complete(state.activeTask.id).catch(console.error);
        }
        dispatch({ type: TaskActionTypes.COMPLETE_TASK });
        worker.terminate();
      } else {
        dispatch({
          type: TaskActionTypes.COUNT_DOWN,
          payload: { secondsRemaining: countDownSeconds },
        });
      }
    });
  }, [worker, state.activeTask]);

  // Controla Worker + cria/interrompe task na API
  useEffect(() => {
    if (!state.activeTask) {
      worker.terminate();
    } else {
      // Cria a task na API quando inicia
      tasksService.create({
        id: state.activeTask.id,
        name: state.activeTask.name,
        duration: state.activeTask.duration,
        type: state.activeTask.type,
        startDate: state.activeTask.startDate,
      }).catch(console.error);

      worker.postMessage({
        activeTask: state.activeTask,
        secondsRemaining: state.secondsRemaining,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worker, state.activeTask]);

  // Salva no localStorage e atualiza title
  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));
    document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`;
  }, [state]);

  // Gerencia som do Beep
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