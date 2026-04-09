import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import type { TaskStateModel } from '../../models/TaskStateModel';
import { MainTemplate } from '../../templates/MainTemplate';

// 1. Exportamos o tipo para reutilizar depois
export type HomeProps = {
  state: TaskStateModel;
  setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
};

export function Home(props: HomeProps) {
  // A Home não usa o state, ela só serve de "ponte"
  return (
    <MainTemplate>
      <Container>
        {/* 2. Repassamos tudo que a Home recebeu para o CountDown */}
        <CountDown {...props} />
      </Container>

      <Container>
        {/* ...e para o MainForm! */}
        <MainForm {...props} />
      </Container>
    </MainTemplate>
  );
}