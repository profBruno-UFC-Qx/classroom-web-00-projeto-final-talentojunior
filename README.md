[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/IDEzcQ6G)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=23242006)

## 🐶🏠 Adote Lar

O projeto Adote Lar é uma plataforma web desenvolvida com o objetivo de apoiar a proteção animal por meio da conexão entre ONGs, abrigos e protetores independentes com pessoas dispostas a oferecer lares temporários para animais resgatados.

## :technologist: Membros da equipe

569554 - Antônio Kauã Silva Barros - Ciências da computação

569707 - Íkaro Freitas de Almeida - Ciências da computação

## :bulb: Objetivo Geral

ONGs e protetores independentes frequentemente resgatam animais feridos, abandonados ou em situação de risco, porém enfrentam uma limitação crítica: a falta de espaço físico. Enquanto um animal ocupa uma vaga em abrigo ou lar temporário, novos animais continuam expostos a riscos nas ruas, criando um "efeito funil" que impede novos resgates.

O Adote Lar surge como uma solução para esse problema, funcionando como um marketplace de micro-voluntariado, conectando abrigos e protetores que possuem animais resgatados com voluntários dispostos a oferecer lares temporários.

O viés de extensão e impacto social se dá por:
- Aumentar a capacidade de resgate de ONGs e protetores independentes
- Reduzir o número de animais abandonados nas ruas
- Proporcionar um ambiente doméstico mais saudável para os animais resgatados
- Facilitar a socialização dos animais, aumentando as chances de adoção definitiva
- Incentivar a cultura de voluntariado e proteção animal na comunidade

## :eyes: Público-Alvo

Protetores de Lar Temporário:

- Pessoas interessadas em acolher animais temporariamente
- Voluntários que desejam contribuir com a causa animal
- Famílias que possuem espaço e disponibilidade para cuidados temporários
- ONGs / Abrigos / Protetores Independentes:
- Organizações de proteção animal
- Abrigos com limitação de espaço físico
- Protetores independentes que realizam resgates

Comunidade em Geral:

- Pessoas interessadas em conhecer a causa
- Possíveis adotantes futuros
- Voluntários e apoiadores da proteção animal

## :star2: Impacto Esperado

Impacto Social e Inclusão: O projeto busca ampliar a capacidade de resgate de animais, reduzir o abandono e incentivar a cultura de voluntariado. Ao facilitar o acesso a lares temporários, mais animais poderão ser retirados das ruas e encaminhados para adoção responsável.

## :people_holding_hands: Papéis ou tipos de usuário da aplicação

Protetor de Lar Temporário (Autenticado):

- Acesso à área pública e ao Painel do Voluntário
- Pode visualizar animais disponíveis
- Pode solicitar acolhimento temporário
- Pode gerenciar suas próprias solicitações
- Pode atualizar o status do animal sob seus cuidados
- Não pode cadastrar novos animais

ONG / Abrigo / Protetor Independente (Autenticado):

- Acesso ao Painel da Organização
- Possui permissão total (CRUD) sobre a entidade Animal
- Pode visualizar solicitações de voluntários
- Pode aprovar ou recusar solicitações
- Pode acompanhar status dos animais
Administrador (Autenticado):

- Acesso total ao sistema
- Pode aprovar, suspender ou excluir cadastros
- Pode remover animais ou solicitações indevidas
- Pode gerenciar todo o sistema

Tenha em mente que obrigatoriamente a aplicação deve possuir funcionalidades acessíveis a todos os tipos de usuário e outras funcionalidades restritas a certos tipos de usuários.

## :triangular_flag_on_post: Principais funcionalidades da aplicação

Para Protetores de Lar Temporário:
- Visualização de Animais Disponíveis
- Solicitação de Lar Temporário
- Acompanhamento do status da solicitação
- Atualização do status do animal sob cuidados

Para ONGs / Abrigos:

- Gestão de Animais (CRUD)
- Visualização de Solicitações
- Aprovação ou Recusa de Voluntários
- Acompanhamento do status dos animais

Funcionalidades Gerais do Sistema:
- Vitrine Pública com animais disponíveis
- Cadastro de voluntários e organizações
- Segurança e Controle de Acesso com JWT
- Design Responsivo com Bootstrap

## :spiral_calendar: Entidades ou tabelas do sistema

User (Usuário):
- Tabela padrão do Strapi. Armazena os dados de acesso, informações de perfil e o papel do usuário (Protetor, ONG ou Admin).

Animal:
- Entidade que representa o animal disponível para lar temporário.
- Atributos: Nome, Especie, Idade, Descricao, Status (Disponível, Em Lar Temporário, Adotado), NecessidadesEspeciais, Foto
- Relacionamento: Pertence a 1 User (ONG/Abrigo responsável)

SolicitacaoLarTemporario:
- Entidade dependente que conecta o voluntário ao animal.
- Atributos: DataSolicitacao, Status (Pendente, Aprovado, Recusado, Finalizado)
- Relacionamento: Pertence a 1 User (Protetor de Lar Temporário) e a 1 Animal

Justificativa da restrição:
- Não é possível criar uma solicitação sem que exista previamente um animal cadastrado.
