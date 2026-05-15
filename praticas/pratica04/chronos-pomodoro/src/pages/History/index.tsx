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
import { useEffect, useState, useMemo } from 'react'; // Adicionado useMemo
import { TaskActionTypes } from '../../contexts/TaskContext/TaskActions';
import { showMessage } from '../../adapters/showMessage';
import { toast } from 'react-toastify';

export function History() {
  const { state, dispatch } = useTaskContext();
  const hasTasks = state.tasks.length > 0;

  // 1. Guardamos apenas os critérios de ordenação no estado
  const [sortConfig, setSortConfig] = useState<{
    field: keyof SortTasksOptions['tasks'][0];
    direction: 'asc' | 'desc';
  }>({
    field: 'startDate',
    direction: 'desc',
  });

  // 2. O useMemo recalcula a lista ordenada sempre que as tarefas ou a configuração mudarem
  // Isso elimina a necessidade de um useEffect com setState (que causava o erro)
  const sortedTasks = useMemo(() => {
    return sortTasks({
      tasks: state.tasks,
      field: sortConfig.field,
      direction: sortConfig.direction,
    });
  }, [state.tasks, sortConfig]);

  // Efeito para o título da página
  useEffect(() => {
    document.title = 'Histórico - Chronos Pomodoro';
  }, []);

  // Limpa mensagens ao desmontar o componente
  useEffect(() => {
    return () => {
      showMessage.dismiss();
    };
  }, []);

  // 3. Função de ordenação simplificada
  function handleSortTasks({ field }: { field:  }) {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  }

  // 4. Função de Reset corrigida (sem precisar de useEffect extra)
  function handleResetHistory() {
    showMessage.dismiss();
    showMessage.confirm('Tem certeza que deseja apagar todo o histórico?', confirmation => {
      if (confirmation) {
        dispatch({ type: TaskActionTypes.RESET_STATE });
        toast.success("Histórico limpo com sucesso!");
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
        {hasTasks && (
          <div className={styles.responsiveTable}>
            <table>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSortTasks({ field: 'name' })}
                    className={styles.thSort}
                  >
                    Tarefa ↕
                  </th>
                  <th
                    onClick={() => handleSortTasks({ field: 'duration' })}
                    className={styles.thSort}
                  >
                    Duração ↕
                  </th>
                  <th
                    onClick={() => handleSortTasks({ field: 'startDate' })}
                    className={styles.thSort}
                  >
                    Data ↕
                  </th>
                  <th>Status</th>
                  <th>Tipo</th>
                </tr>
              </thead>

              <tbody>
                {/* Agora usamos sortedTasks diretamente aqui */}
                {sortedTasks.map(task => {
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
                      <td>{taskTypeDictionary[task.type]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!hasTasks && (
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Ainda não existem tarefas criadas.
          </p>
        )}
      </Container>
    </MainTemplate>
  );
}