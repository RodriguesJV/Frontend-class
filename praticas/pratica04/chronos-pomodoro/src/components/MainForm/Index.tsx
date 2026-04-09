import { PlayCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import type { HomeProps } from '../../pages/Home';

export function MainForm({ state, setState }: HomeProps) {
  // Função de teste para alterar o estado global
  function handleClick() {
    setState(prevState => {
      return {
        ...prevState, // Copia o estado principal
        config: {
          ...prevState.config, // Copia o objeto 'config'
          workTime: 34, // Altera apenas o workTime
        },
        formattedSecondsRemaining: '23:34', // Atualiza o cronômetro
      };
    });
  }

  return (
    <form className='form' action=''>
      <div>
        {/* Botão de teste! type="button" evita que ele recarregue a página */}
        <button type='button' onClick={handleClick}>
          Testar Alteração de Estado
        </button>
      </div>

      <div className='formRow'>
        <DefaultInput
          labelText='task'
          id='meuInput'
          type='text'
          placeholder='Digite algo'
        />
      </div>

      <div className='formRow'>
        {/* Consumindo o estado global */}
        <p>Próximo intervalo é de {state.config.workTime}min</p>
      </div>

      <div className='formRow'>
        <Cycles />
      </div>

      <div className='formRow'>
        <DefaultButton icon={<PlayCircleIcon />} />
      </div>
    </form>
  );
}