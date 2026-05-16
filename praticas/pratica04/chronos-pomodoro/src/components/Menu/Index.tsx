import {
  HistoryIcon,
  HouseIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  LogOutIcon, // Adicionado o ícone de logout
} from 'lucide-react';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { RouterLink } from '../RouterLink';
import { useAuthContext } from '../../contexts/AuthContext'; // Importando o contexto de autenticação
import { useNavigate } from 'react-router'; // Importando para redirecionar após deslogar

type AvailableThemes = 'dark' | 'light';

export function Menu() {
  const { logout } = useAuthContext(); // Pegando a função de logout
  const navigate = useNavigate(); // Hook para redirecionamento

  const [theme, setTheme] = useState<AvailableThemes>(() => {
    const storageTheme =
      (localStorage.getItem('theme') as AvailableThemes) || 'dark';
    return storageTheme;
  });

  const nextThemeIcon = {
    dark: <SunIcon />,
    light: <MoonIcon />,
  };

  function handleThemeChange(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    event.preventDefault();

    setTheme(prevTheme => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      return nextTheme;
    });
  }

  // Função para lidar com o clique no botão de sair
  function handleLogout(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    logout(); // Limpa a sessão
    navigate('/'); // Manda o usuário de volta para a tela de login
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className={styles.menu}>
      {/* Ajustado de '/' para '/home' conforme a observação de correção */}
      <RouterLink
        className={styles.menuLink}
        href='/home'
        aria-label='Ir para a Home'
        title='Ir para a Home'
      >
        <HouseIcon />
      </RouterLink>

      <RouterLink
        className={styles.menuLink}
        href='/history/'
        aria-label='Ver Histórico'
        title='Ver Histórico'
      >
        <HistoryIcon />
      </RouterLink>

      <RouterLink
        className={styles.menuLink}
        href='/settings/'
        aria-label='Configurações'
        title='Configurações'
      >
        <SettingsIcon />
      </RouterLink>

      <a
        className={styles.menuLink}
        href='#'
        aria-label='Mudar Tema'
        title='Mudar Tema'
        onClick={handleThemeChange}
      >
        {nextThemeIcon[theme]}
      </a>

      {/* Novo botão de Logout exigido pelo projeto */}
      <a
        className={styles.menuLink}
        href='#'
        aria-label='Sair do Aplicativo'
        title='Sair'
        onClick={handleLogout}
      >
        <LogOutIcon />
      </a>
    </nav>
  );
}