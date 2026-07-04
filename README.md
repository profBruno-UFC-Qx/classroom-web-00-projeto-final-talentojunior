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

## Voluntários

- Pessoas interessadas em oferecer lar temporário;
- Famílias que desejam ajudar animais resgatados;
- Pessoas que futuramente pretendem adotar.

## ONGs e Abrigos

- ONGs de proteção animal;
- Abrigos;
- Protetores independentes.


## :star2: Impacto Esperado

Impacto Social e Inclusão: O projeto busca ampliar a capacidade de resgate de animais, reduzir o abandono e incentivar a cultura de voluntariado. Ao facilitar o acesso a lares temporários, mais animais poderão ser retirados das ruas e encaminhados para adoção responsável.

# :people_holding_hands: Tipos de UsuárioPapéis ou tipos de usuário da aplicação

## Voluntário

Pode:

- realizar cadastro;
- editar seu perfil;
- visualizar animais disponíveis;
- solicitar acolhimento;
- acompanhar suas solicitações;
- finalizar acolhimentos.

---

## ONG / Abrigo

Pode:

- realizar cadastro;
- cadastrar animais;
- editar animais;
- remover animais;
- visualizar solicitações;
- aprovar ou recusar solicitações;
- acompanhar acolhimentos.

---


# 🚀 Funcionalidades

## Área Pública

- Cadastro de voluntários
- Cadastro de ONGs
- Login utilizando JWT
- Visualização dos animais disponíveis
- Visualização das informações das ONGs

---

## Área do Voluntário

- Editar perfil
- Solicitar acolhimento
- Visualizar solicitações
- Atualizar informações pessoais
- Configurar notificações
- Finalizar acolhimentos

---

## Área da ONG

- Cadastro de animais
- Edição de animais
- Exclusão de animais
- Upload de imagem de capa
- Upload de múltiplas imagens
- Aprovar solicitações
- Recusar solicitações
- Gerenciar perfil da ONG

---

# 🔐 Controle de Acesso

A autenticação é realizada utilizando **JWT**, através do plugin **Users & Permissions** do Strapi.

Existem dois perfis principais:

- ONG
- Voluntário

Cada perfil possui permissões específicas para acesso aos endpoints.

---

# 🗄️ Modelagem do Sistema

## Usuário (Users & Permissions)

Tabela nativa do Strapi utilizada para autenticação.

### Responsabilidades

- login
- senha
- e-mail
- permissões
- autenticação JWT

Relacionamentos:

- 1 ONG
- 1 Voluntário

---

# 🐶 Animal

Representa um animal disponível para acolhimento.

## Atributos

| Campo | Tipo |
|--------|------|
| nome | string |
| animal_id | uid |
| especie | string |
| idade | integer |
| porte | string |
| disponivel | boolean |
| status_do_animal | string |
| sobre | text |
| localizacao | string |
| caracteristicas_do_animal | json |
| caracteristicas_gerais | json |
| necessidades_especiais | json |
| data_de_entrada | date |
| data_de_acolhimento | date |
| data_solicitacao | datetime |
| imagem_capa | media |
| imagens | media[] |

Relacionamentos:

- pertence a uma ONG
- possui uma Solicitação

---

# 🏢 ONG

Representa uma organização responsável pelos animais.

## Atributos

| Campo | Tipo |
|--------|------|
| nome | string |
| cnpj | string |
| id_ong | uid |
| nome_responsavel | string |
| telefone | string |
| endereco | text |
| bio | text |
| animais_que_trabalha | json |
| requisitos_minimos | text |
| preferencias_notificacoes | json |
| imagem_perfil | media |

Relacionamentos:

- possui vários animais
- possui um usuário
- possui relacionamento com voluntários

---

# 🙋 Voluntário

Representa um usuário que oferece lar temporário.

## Atributos

| Campo | Tipo |
|--------|------|
| nome | string |
| email | email |
| cidade | string |
| descricao | string |
| aceita_gato | boolean |
| aceita_cachorro | boolean |
| porte_maximo | enum |
| possui_animais | boolean |
| notificacoes_email | boolean |
| notificacoes_push | boolean |
| notificacoes_whatsapp | boolean |
| imagem_perfil | media |

Relacionamentos:

- possui um usuário
- relaciona-se com ONGs

---

# 📄 Solicitação

Representa uma solicitação de acolhimento de um animal.

## Atributos

| Campo | Tipo |
|--------|------|
| id_solicitacao | uid |
| aprovada | boolean |
| finalizada | boolean |
| acolhimento_finalizado | boolean |

Relacionamentos:

- um Animal
- um Voluntário

---

# 🔗 Relacionamentos

```
User
 ├── 1 ONG
 └── 1 Voluntário

ONG
 ├── 1:N Animal
 └── N:N Voluntário

Animal
 ├── N:1 ONG
 └── 1:1 Solicitação

Solicitação
 ├── 1:1 Animal
 └── 1:1 Voluntário
```