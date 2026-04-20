import type { TaskModel } from '../../models/TaskModel';
import { useRef } from 'react';
import { PlayCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import { useTaskContext } from '../../contexts/useTaskContext';

export function MainForm() {
  const { setState } = useTaskContext();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const inputValue = inputRef.current?.value ?? '';
  if (!inputValue) return;

  setState(prevState => {
    const newTask: TaskModel = {
      id: crypto.randomUUID(),
      name: inputValue,
      duration: prevState.config.workTime,
      startDate: Date.now(),
      completeDate: null,
      interruptDate: null,
      type: 'workTime',
    };

    return {
      ...prevState,
      config: { ...prevState.config },
      activeTask: newTask,
      currentCycle: 1,
      secondsRemaining: prevState.config.workTime * 60,
      formattedSecondsRemaining: '00:00',
      tasks: [...prevState.tasks, newTask],
    };
  });

  if (inputRef.current) inputRef.current.value = '';
}

  return (
    <form className="form" onSubmit={handleCreateNewTask}>
      <div className="formRow">
        <DefaultInput
          labelText="task"
          id="meuInput"
          type="text"
          placeholder="Digite algo"
          ref={inputRef}
        />
      </div>

      <div className="formRow">
        <p>Próximo intervalo é de 25min</p>
      </div>

      <div className="formRow">
        <Cycles />
      </div>

      <div className="formRow">
        <DefaultButton icon={<PlayCircleIcon />} />
      </div>
    </form>
  );
}