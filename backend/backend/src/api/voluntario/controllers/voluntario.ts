"use strict";

import { factories } from "@strapi/strapi";
const { createCoreController } = factories;

function formatImagemPerfil(imagem: any) {
  const imagemPerfil = Array.isArray(imagem) ? imagem[0] : imagem;

  if (!imagemPerfil) return null;

  return {
    id: imagemPerfil.id,
    url: imagemPerfil.url,
    name: imagemPerfil.name,
  };
}

function formatVoluntarioResponse(voluntario: any) {
  return {
    id: voluntario.id,
    nome: voluntario.nome || "",
    email: voluntario.email || "",
    cidade: voluntario.cidade || "",
    descricao: voluntario.descricao || "",
    aceita_cachorro: voluntario.aceita_cachorro ?? false,
    aceita_gato: voluntario.aceita_gato ?? false,
    porte_maximo: voluntario.porte_maximo || "medio",
    imagem_perfil: formatImagemPerfil(voluntario.imagem_perfil),
    possui_animais: voluntario.possui_animais ?? false,
    notificacoes_email: voluntario.notificacoes_email ?? false,
    notificacoes_push: voluntario.notificacoes_push ?? false,
    notificacoes_whatsapp: voluntario.notificacoes_whatsapp ?? false,
  };
}

module.exports = createCoreController("api::voluntario.voluntario", ({ strapi }) => ({
  async register(ctx) {
    const { nome, email, senha, confirmacaoSenha, cidade } = ctx.request.body;

    if (!nome || !email || !senha || !confirmacaoSenha || !cidade) {
      return ctx.badRequest(
        "Por favor, preencha todos os campos obrigatórios."
      );
    }

    if (senha !== confirmacaoSenha) {
      return ctx.badRequest("A senha e a confirmação de senha não coincidem.");
    }

    try {
      const emailLower = email.toLowerCase().trim();

      const userExists = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email: emailLower },
        });

      if (userExists) {
        return ctx.badRequest("Este e-mail já está cadastrado.");
      }

      const defaultRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({
          where: { type: "authenticated" },
        });

      if (!defaultRole) {
        return ctx.internalServerError("Role authenticated não encontrada.");
      }

      const newUser = await strapi.entityService.create(
        "plugin::users-permissions.user",
        {
          data: {
            username: emailLower,
            email: emailLower,
            password: senha,
            provider: "local",
            confirmed: true,
            blocked: false,
            role: defaultRole.id,
          },
        }
      );

      const newVoluntario = await strapi.entityService.create(
        "api::voluntario.voluntario",
        {
          data: {
            nome,
            email: emailLower,
            cidade,
            descricao: "",
            aceita_cachorro: false,
            aceita_gato: false,
            porte_maximo: "medio",
            users_permissions_user: newUser.id,
            publishedAt: new Date(),
          },
        }
      );

      const jwt = strapi.plugin("users-permissions").service("jwt").issue({
        id: newUser.id,
      });

      return {
        jwt,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
        },
        voluntario: newVoluntario,
      };
    } catch (err) {
      console.error("Erro ao registrar voluntário:", err);
      return ctx.internalServerError(
        err.message || "Erro ao registrar o voluntário."
      );
    }
  },

  async me(ctx) {
    try {
      const loggedUser = ctx.state.user;

      if (!loggedUser) {
        return ctx.unauthorized("Usuário não autenticado.");
      }

      const voluntarios = await strapi.entityService.findMany("api::voluntario.voluntario", {
        filters: { users_permissions_user: { id: loggedUser.id } },
        populate: { users_permissions_user: true, imagem_perfil: true },
      }) as any[];

      const voluntario = Array.isArray(voluntarios) ? voluntarios[0] : voluntarios;

      if (!voluntario) {
        return ctx.notFound("Voluntário não encontrado para este usuário.");
      }

      return {
        voluntario: formatVoluntarioResponse(voluntario),
      };
    } catch (err) {
      console.error("Erro ao buscar voluntário logado:", err);
      return ctx.internalServerError("Erro ao buscar dados do voluntário.");
    }
  },

  async updateMe(ctx) {
    try {
      const loggedUser = ctx.state.user;

      if (!loggedUser) {
        return ctx.unauthorized("Usuário não autenticado.");
      }

      const voluntarios = await strapi.entityService.findMany(
        "api::voluntario.voluntario",
        {
          filters: {
            users_permissions_user: {
              id: loggedUser.id,
            },
          },
        }
      );

      const voluntario = Array.isArray(voluntarios) ? voluntarios[0] : voluntarios;

      if (!voluntario) {
        return ctx.notFound("Voluntário não encontrado para este usuário.");
      }

      const {
        nome,
        cidade,
        descricao,
        aceita_cachorro,
        aceita_gato,
        porte_maximo,
        possui_animais,
        notificacoes_email,
        notificacoes_push,
        notificacoes_whatsapp,
      } = ctx.request.body;
      const updatedVoluntario = await strapi.entityService.update(
        "api::voluntario.voluntario",
        voluntario.id,
        {
          data: {
            nome,
            cidade,
            descricao,
            aceita_cachorro,
            aceita_gato,
            porte_maximo,
            possui_animais,
            notificacoes_email,
            notificacoes_push,
            notificacoes_whatsapp,
          },
          populate: { imagem_perfil: true },
        },
      );

      return {
        voluntario: formatVoluntarioResponse(updatedVoluntario),
      };
    } catch (err) {
      console.error("Erro ao atualizar voluntário:", err);
      return ctx.internalServerError(
        err.message || "Erro ao atualizar dados do voluntário."
      );
    }
  },

  async uploadProfileImage(ctx) {
    try {
      const loggedUser = ctx.state.user;
      if (!loggedUser) return ctx.unauthorized("Usuário não autenticado.");

      const voluntarios = await strapi.entityService.findMany("api::voluntario.voluntario", {
        filters: { users_permissions_user: { id: loggedUser.id } },
        populate: { imagem_perfil: true },
      }) as any[];

      const voluntario = Array.isArray(voluntarios) ? voluntarios[0] : voluntarios;

      if (!voluntario) return ctx.notFound("Voluntário não encontrado.");

      const { files } = ctx.request;
      if (!files || !files.imagem) return ctx.badRequest("Nenhuma imagem foi enviada.");

      const uploadedFiles = await strapi
        .plugin("upload")
        .service("upload")
        .upload({
          data: {},
          files: files.imagem,
        });

      const uploadedFile = uploadedFiles?.[0];
      if (!uploadedFile) return ctx.internalServerError("Falha ao fazer upload da imagem.");

      const updatedVoluntario = await strapi.entityService.update(
        "api::voluntario.voluntario",
        voluntario.id,
        {
          data: { imagem_perfil: uploadedFile.id },
          populate: { imagem_perfil: true },
        }
      ) as any;

      return {
        message: "Imagem de perfil atualizada com sucesso.",
        imagem_perfil: formatImagemPerfil(updatedVoluntario.imagem_perfil),
      };
    } catch (err) {
      console.error("Erro ao fazer upload da imagem de perfil:", err);
      return ctx.internalServerError(err.message || "Erro ao atualizar imagem de perfil.");
    }
  },
}));