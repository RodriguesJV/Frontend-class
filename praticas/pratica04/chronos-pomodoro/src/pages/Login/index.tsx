import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { DefaultInput } from '../../components/DefaultInput';
import { useAuthContext } from '../../contexts/AuthContext';
import { showMessage } from '../../adapters/showMessage';
import styles from './styles.module.css';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username.trim()) {
      showMessage.warn('Informe o usuário');
      return;
    }

    if (!password) {
      showMessage.warn('Informe a senha');
      return;
    }

    if (login(username, password)) {
      showMessage.success('Bem-vindo!');
      navigate('/home');
    } else {
      showMessage.error('Usuário ou senha inválidos');
    }
  }

  return (
    <div className={styles.screenContainer}>
      <form onSubmit={handleSubmit} className={styles.loginCard}>
        <h2 className={styles.title}>Chronos Pomodoro</h2>

        <div className={styles.inputsWrapper}>
          <DefaultInput
            id="login-user"
            labelText="Usuário"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <DefaultInput
            id="login-pass"
            labelText="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.buttonSubmit}>
          Entrar
        </button>

        <div className={styles.actionsContainer}>
          <button 
            type="button" 
            className={styles.linkButton}
            onClick={() => showMessage.info('Fluxo de cadastro ainda será implementado')}
          >
            Cadastrar
          </button>
          
          <button 
            type="button" 
            className={styles.linkButton}
            onClick={() => showMessage.info('Fluxo de recuperação de senha ainda será implementado')}
          >
            Esqueci minha senha
          </button>
        </div>
      </form>
    </div>
  );
}