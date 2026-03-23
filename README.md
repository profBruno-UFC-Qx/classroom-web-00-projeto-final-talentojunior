[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/IDEzcQ6G)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=23242006)
# :checkered_flag: Talento Junior

O projeto *TalentoJúnior* é uma plataforma web desenvolvida com o objetivo de aproximar estudantes e recém-formados do mercado de trabalho local. A plataforma facilita a conexão entre universitários que buscam sua primeira oportunidade e empresas da região que procuram talentos em início de carreira (estágio, trainee e nível júnior).


## :technologist: Membros da equipe
569554 - Antônio Kauã Silva Barros - Ciências da computação
569707 - Íkaro Freitas de Almeida - Ciências da computação


## :bulb: Objetivo Geral

Diferente de plataformas tradicionais, o foco é exclusivo no público universitário, reduzindo as barreiras da "experiência prévia". O viés de extensão e o impacto social se dão por:
* Facilitar o acesso de recém-formados a oportunidades de emprego.
* Apoiar estudantes em situação de vulnerabilidade na conquista do primeiro emprego.
* Incentivar o desenvolvimento econômico local, fortalecendo a relação entre a universidade e o setor produtivo.

## :eyes: Público-Alvo
1. Estudantes e Recém-formados:
  - Alunos de graduação em busca de estágios obrigatórios ou não obrigatórios.
  - Egressos (recém-formados) que procuram posições de nível Trainee ou Júnior.
  - Jovens talentos que possuem forte base acadêmica, mas enfrentam a barreira da "falta de experiência prévia" exigida em plataformas tradicionais.
2. Empresas e Empregadores Locais:
  - Pequenas e médias empresas (PMEs), startups e comércios da região que buscam talentos com vontade de aprender e inovar.
  - Departamentos de Recursos Humanos que desejam otimizar o recrutamento focando exclusivamente em profissionais em início de carreira, reduzindo custos de contratação.
3. Universidade (Mediadora):
  - Coordenações de cursos e projetos de extensão que precisam de uma ferramenta para monitorar a inserção de seus alunos no mercado de trabalho.

## :star2: Impacto Esperado
Impacto Social e Inclusão: Democratiza o acesso à primeira oportunidade de emprego, apoiando especialmente estudantes em situação de vulnerabilidade que não possuem forte networking profissional (o famoso "QI - Quem Indica").

## :people_holding_hands: Papéis ou tipos de usuário da aplicação

1. *Estudante / Recém-formado (Autenticado):*
   * Acesso à área pública e ao Painel do Candidato.
   * Pode visualizar todas as vagas e realizar candidaturas.
   * Pode gerenciar (visualizar e cancelar) as suas próprias candidaturas.
   * Não pode criar ou gerenciar vagas.

2. *Empresa / Recrutador (Autenticado):*
   * Acesso ao Painel da Empresa.
   * Possui permissão total (CRUD) sobre a entidade *Vaga*, mas gerencia apenas as vagas que a própria empresa publicou.
   * Pode visualizar os estudantes que se candidataram às suas vagas.
   * Não pode se candidatar a vagas de outras empresas.

3. *Administrador / Coordenação de Extensão (Autenticado):*
   * Acesso total ao sistema.
   * Pode aprovar, suspender ou excluir cadastros de Empresas para garantir a segurança dos estudantes.
   * Pode remover vagas que não estejam de acordo com as diretrizes do projeto (ex: vagas que exijam experiência prévia abusiva).

> Tenha em mente que obrigatoriamente a aplicação deve possuir funcionalidades acessíveis a todos os tipos de usuário e outra funcionalidades restritas a certos tipos de usuários.

## :triangular_flag_on_post:	 Principais funcionalidades da aplicação

Para Estudantes / Recém-formados:
  - Perfil Profissional Acadêmico: Criação de um currículo digital destacando curso, semestre, projetos acadêmicos e habilidades (hard e soft skills).
  - Mural de Vagas Filtrado: Busca de oportunidades exclusivas para quem tem pouca ou nenhuma experiência, com filtros por área de atuação e tipo de vaga (Estágio, Trainee, Júnior).
  - Candidatura Simplificada: Aplicação para as vagas com apenas um clique e acompanhamento em tempo real do status do processo seletivo (Em análise, Aprovado, Recusado).

Para Empresas:
  - Gestão de Vagas (CRUD): Painel intuitivo para criar, editar, pausar e excluir oportunidades de emprego de forma autônoma.
  - Triagem de Talentos: Visualização da lista de estudantes que se candidataram a uma vaga específica, com acesso direto aos perfis e contatos dos candidatos.
  - Gestão de Candidaturas: Ferramenta para atualizar o status do candidato, organizando o funil de recrutamento.

Funcionalidades Gerais do Sistema:
  - Vitrine Pública: Área não logada para dar visibilidade às vagas e atrair novos usuários.
  - Segurança e Controle de Acesso: Sistema de autenticação via token (JWT) com permissões estritas baseadas no papel do usuário (Estudante não vê painel de Empresa e vice-versa).
  - Design Responsivo: Interface construída com Bootstrap, garantindo que estudantes possam buscar vagas pelo celular e recrutadores possam gerenciar processos pelo computador.

## :spiral_calendar: Entidades ou tabelas do sistema

1. *User (Usuário):* Tabela padrão do Strapi. Armazena os dados de acesso, informações de perfil (nome/razão social, contato) e o papel (Role: Estudante, Empresa ou Admin).
2. *Vaga:* Entidade que representa a oportunidade de emprego.
   * Atributos: Titulo, Descricao, Requisitos, BolsaSalario, Tipo (Estágio, Trainee, Júnior), Status (Aberta/Fechada).
   * Relacionamento: Pertence a 1 User (a Empresa criadora).
3. *Candidatura:* Entidade dependente que conecta o Estudante à Vaga.
   * Atributos: DataCandidatura, Status (Em Análise, Aprovado, Recusado).
   * Relacionamento: Pertence a 1 User (Estudante) e a 1 Vaga. *Justificativa da restrição:* Os CRUDs não são independentes, pois é impossível criar uma candidatura no sistema sem vinculá-la a uma vaga previamente existente.


----

:warning::warning::warning: As informações a seguir devem ser enviadas juntamente com a versão final do projeto. :warning::warning::warning:


----

## :desktop_computer: Tecnologias e frameworks utilizados

**Frontend:**

Lista as tecnologias, frameworks e bibliotecas utilizados.

**Backend:**

Lista as tecnologias, frameworks e bibliotecas utilizados.


## :shipit: Operações implementadas para cada entidade da aplicação


| Entidade| Criação | Leitura | Atualização | Remoção |
| --- | --- | --- | --- | --- |
| Entidade 1 | X |  X  |  | X |
| Entidade 2 | X |    |  X | X |
| Entidade 3 | X |    |  |  |

> Lembre-se que é necessário implementar o CRUD de pelo menos duas entidades.

## :neckbeard: Rotas da API REST utilizadas

| Método HTTP | URL |
| --- | --- |
| GET | api/entidade1/|
| POST | api/entidade2 |
