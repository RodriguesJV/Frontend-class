import { TrashIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';

import styles from './styles.module.css';
import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { formatDate } from '../../utils/formatDate';
import { getTaskStatus } from '../../utils/getTaskStatus';
import { sortTasks, type SortTasksOptions } from '../../utils/sortTasks';
import { useEffect, useState, useMemo } from 'react';
import { TaskActionTypes } from '../../contexts/TaskContext/TaskActions';
import { showMessage } from '../../adapters/showMessage';
import { tasksService } from '../../services/tasksService';

export function History() {
  const { state, dispatch } = useTaskContext();
  const hasTasks = state.tasks.length > 0;
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [sortOptions, setSortOptions] = useState<{
    field: SortTasksOptions['field'];
    direction: SortTasksOptions['direction'];
  }>({
    field: 'startDate',
    direction: 'desc',
  });

  const orderedTasks = useMemo(() => {
    return sortTasks({
      tasks: state.tasks,
      field: sortOptions.field,
      direction: sortOptions.direction,
    });
  }, [state.tasks, sortOptions.field, sortOptions.direction]);

  useEffect(() => {
    document.title = 'Histórico - Chronos Pomodoro';
  }, []);

  useEffect(() => {
    return () => {
      showMessage.dismiss();
    };
  }, []);

  useEffect(() => {
    tasksService.getAll()
      .then(tasks => {
        dispatch({ type: TaskActionTypes.SET_TASKS, payload: tasks });
      })
      .catch(() => {
        showMessage.error('Erro ao carregar histórico');
      })
      .finally(() => {
        setIsLoadingHistory(false);
      });
  }, [dispatch]);

  function handleSortTasks({ field }: Pick<SortTasksOptions, 'field'>) {
    setSortOptions(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  }

  async function handleResetHistory() {
    showMessage.dismiss();
    showMessage.confirm('Tem certeza?', async confirmation => {
      if (confirmation) {
        try {
          await tasksService.deleteAll();
          dispatch({ type: TaskActionTypes.RESET_STATE });
        } catch {
          showMessage.error('Erro ao apagar histórico');
        }
      }
    });
  }

  return (
    <MainTemplate>
      <Container>
        <Heading>
          <span>History</span>
          {hasTasks && (
            <span className={styles.buttonContainer}>
              <DefaultButton
                icon={<TrashIcon />}
                color='red'
                aria-label='Apagar todo o histórico'
                title='Apagar histórico'
                onClick={handleResetHistory}
              />
            </span>
          )}
        </Heading>
      </Container>

      <Container>
        {isLoadingHistory && (
          <p style={{ textAlign: 'center' }}>Carregando histórico...</p>
        )}

        {!isLoadingHistory && !hasTasks && (
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Ainda não existem tarefas criadas.
          </p>
        )}

        {!isLoadingHistory && hasTasks && (
          <div className={styles.responsiveTable}>
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSortTasks({ field: 'name' })} className={styles.thSort}>
                    Tarefa ↕
                  </th>
                  <th onClick={() => handleSortTasks({ field: 'duration' })} className={styles.thSort}>
                    Duração ↕
                  </th>
                  <th onClick={() => handleSortTasks({ field: 'startDate' })} className={styles.thSort}>
                    Data ↕
                  </th>
                  <th>Status</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {orderedTasks.map(task => {
                  const taskTypeDictionary = {
                    workTime: 'Foco',
                    shortBreakTime: 'Descanso curto',
                    longBreakTime: 'Descanso longo',
                  };
                  return (
                    <tr key={task.id}>
                      <td>{task.name}</td>
                      <td>{task.duration}min</td>
                      <td>{formatDate(task.startDate)}</td>
                      <td>{getTaskStatus(task, state.activeTask)}</td>
                      <td>{taskTypeDictionary[task.type as keyof typeof taskTypeDictionary] || task.type}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </MainTemplate>
  );
}