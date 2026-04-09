import type { HomeProps } from '../../pages/Home';
import styles from './styles.module.css';

// Usamos a tipagem exportada da Home
export function CountDown({ state }: HomeProps) {
  return (
    {/* Exibe o tempo que está no estado global */}
    <div className={styles.container}>{state.formattedSecondsRemaining}</div>
  );
}