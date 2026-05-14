import { Container } from '../../components/Container';
import { GenericHtml } from '../../components/GenericHtml';
import { Heading } from '../../components/Heading';
import { RouterLink } from '../../components/RouterLink';
import { MainTemplate } from '../../templates/MainTemplate';

export function AboutPomodoro() {
  return (
    <MainTemplate>
      <Container>
        <GenericHtml>
          <Heading>A Técnica Pomodoro 🍅</Heading>

          {/* ... restante do conteúdo ... */}

          <p>
            Você pode configurar o tempo de foco, descanso curto e descanso
            longo do jeito que quiser! Basta acessar a{' '}
            <RouterLink href='/settings/'>página de configurações</RouterLink> e
            ajustar os minutos como preferir.
          </p>

          {/* ... restante do conteúdo ... */}

          <p>
            Todas as suas tarefas e ciclos concluídos ficam salvos no{' '}
            <RouterLink href='/history/'>histórico</RouterLink>, com status de
            completas ou interrompidas.
          </p>

          {/* ... restante do conteúdo ... */}

          <p>
            <strong>Pronto pra focar?</strong> Bora lá{' '}
            <RouterLink href='/'>voltar para a página inicial</RouterLink> e
            iniciar seus Pomodoros! 🍅🚀
          </p>
        </GenericHtml>
      </Container>
    </MainTemplate>
  );
}