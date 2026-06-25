"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::ong.ong", ({ strapi }) => ({
  async register(ctx) {
    const { nome, email, senha, confirmacaoSenha } = ctx.request.body;

    if (!nome || !email || !senha || !confirmacaoSenha) {
      return ctx.badRequest(
        "Por favor, preencha todos os campos obrigatórios.",
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
        },
      );

      const newOng = await strapi.entityService.create("api::ong.ong", {
        data: {
          nome,
          email: emailLower,
          user: newUser.id,
          publishedAt: new Date(),
        },
      });

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
        ong: newOng,
      };
    } catch (err) {
      console.error("Erro ao registrar ONG:", err);
      return ctx.internalServerError(err.message || "Erro ao registrar a ONG.");
    }
  },

  async me(ctx) {
    try {
      const loggedUser = ctx.state.user;

      if (!loggedUser) {
        return ctx.unauthorized("Usuário não autenticado.");
      }

      const ongs = await strapi.entityService.findMany("api::ong.ong", {
        filters: {
          user: {
            id: loggedUser.id,
          },
        },
        populate: {
          user: true,
          imagem_perfil: true,
        },
      });

      const ong = Array.isArray(ongs) ? ongs[0] : ongs;

      if (!ong) {
        return ctx.notFound("ONG não encontrada para este usuário.");
      }

      return {
        ong: {
          id: ong.id,
          nome: ong.nome || "",
          cnpj: ong.cnpj || "",
          nome_responsavel: ong.nome_responsavel || "",
          telefone: ong.telefone || "",
          endereco: ong.endereco || "",
          bio: ong.bio || "",
          animais_que_trabalha: ong.animais_que_trabalha || [],
          requesitos_minimos: ong.requesitos_minimos || "",
          preferencias_notificacoes: ong.preferencias_notificacoes || {
            solicitacaoEmail: false,
            solicitacaoPush: false,
            solicitacaoWhatsapp: false,
            statusEmail: false,
            statusPush: false,
            statusWhatsapp: false,
            mensagemEmail: false,
            mensagemPush: false,
            mensagemWhatsapp: false,
          },
          imagem_perfil: ong.imagem_perfil
            ? {
                id: ong.imagem_perfil.id,
                url: ong.imagem_perfil.url,
                name: ong.imagem_perfil.name,
              }
            : null,
        },
      };
    } catch (err) {
      console.error("Erro ao buscar ONG logada:", err);
      return ctx.internalServerError("Erro ao buscar dados da ONG.");
    }
  },

  async updateMe(ctx) {
    try {
      const loggedUser = ctx.state.user;

      if (!loggedUser) {
        return ctx.unauthorized("Usuário não autenticado.");
      }

      const ongs = await strapi.entityService.findMany("api::ong.ong", {
        filters: {
          user: {
            id: loggedUser.id,
          },
        },
        populate: {
          user: true,
        },
      });

      const ong = Array.isArray(ongs) ? ongs[0] : ongs;

      if (!ong) {
        return ctx.notFound("ONG não encontrada para este usuário.");
      }

      const {
        nome,
        cnpj,
        nome_responsavel,
        telefone,
        endereco,
        bio,
        animais_que_trabalha,
        requesitos_minimos,
        preferencias_notificacoes,
      } = ctx.request.body;

      const updatedOng = await strapi.entityService.update(
        "api::ong.ong",
        ong.id,
        {
          data: {
            nome,
            cnpj,
            nome_responsavel,
            telefone,
            endereco,
            bio,
            animais_que_trabalha,
            requesitos_minimos,
            preferencias_notificacoes,
          },
        },
      );

      return {
        ong: {
          id: updatedOng.id,
          nome: updatedOng.nome || "",
          cnpj: updatedOng.cnpj || "",
          nome_responsavel: updatedOng.nome_responsavel || "",
          telefone: updatedOng.telefone || "",
          endereco: updatedOng.endereco || "",
          bio: updatedOng.bio || "",
          animais_que_trabalha: updatedOng.animais_que_trabalha || [],
          requesitos_minimos: updatedOng.requesitos_minimos || "",
          preferencias_notificacoes: updatedOng.preferencias_notificacoes || {
            solicitacaoEmail: false,
            solicitacaoPush: false,
            solicitacaoWhatsapp: false,
            statusEmail: false,
            statusPush: false,
            statusWhatsapp: false,
            mensagemEmail: false,
            mensagemPush: false,
            mensagemWhatsapp: false,
          },
        },
      };
    } catch (err) {
      console.error("Erro ao atualizar ONG:", err);
      return ctx.internalServerError(
        err.message || "Erro ao atualizar dados da ONG.",
      );
    }
  },
  async uploadProfileImage(ctx) {
    try {
      const loggedUser = ctx.state.user;

      if (!loggedUser) {
        return ctx.unauthorized("Usuário não autenticado.");
      }

      const ongs = await strapi.entityService.findMany("api::ong.ong", {
        filters: {
          user: {
            id: loggedUser.id,
          },
        },
        populate: {
          user: true,
          imagem_perfil: true,
        },
      });

      const ong = Array.isArray(ongs) ? ongs[0] : ongs;

      if (!ong) {
        return ctx.notFound("ONG não encontrada para este usuário.");
      }

      const { files } = ctx.request;

      if (!files || !files.imagem) {
        return ctx.badRequest("Nenhuma imagem foi enviada.");
      }

      const uploadedFiles = await strapi
        .plugin("upload")
        .service("upload")
        .upload({
          data: {},
          files: files.imagem,
        });

      const uploadedFile = uploadedFiles?.[0];

      if (!uploadedFile) {
        return ctx.internalServerError("Falha ao fazer upload da imagem.");
      }

      const updatedOng = await strapi.entityService.update(
        "api::ong.ong",
        ong.id,
        {
          data: {
            imagem_perfil: uploadedFile.id,
          },
          populate: {
            imagem_perfil: true,
          },
        },
      );

      return {
        message: "Imagem de perfil atualizada com sucesso.",
        imagem_perfil: updatedOng.imagem_perfil,
      };
    } catch (err) {
      console.error("Erro ao fazer upload da imagem de perfil:", err);
      return ctx.internalServerError(
        err.message || "Erro ao atualizar imagem de perfil.",
      );
    }
  },
}));
