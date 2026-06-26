"use strict";

import { factories } from "@strapi/strapi";
import { permission } from "process";
const { createCoreController } = factories;

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

      const voluntarios = await strapi.entityService.findMany(
        "api::voluntario.voluntario",
        {
          filters: {
            users_permissions_user: {
              id: loggedUser.id,
            },
          },
          populate: { users_permissions_user: true },
        }
      );

      const voluntario = Array.isArray(voluntarios) ? voluntarios[0] : voluntarios;

      if (!voluntario) {
        return ctx.notFound("Voluntário não encontrado para este usuário.");
      }

      return {
        voluntario: {
          id: voluntario.id,
          nome: voluntario.nome || "",
          email: voluntario.email || "",
          cidade: voluntario.cidade || "",
          descricao: voluntario.descricao || "",
          aceita_cachorro: voluntario.aceita_cachorro ?? false,
          aceita_gato: voluntario.aceita_gato ?? false,
          porte_maximo: voluntario.porte_maximo || "medio",
        },
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

      const { nome, cidade, descricao, aceita_cachorro, aceita_gato, porte_maximo } = ctx.request.body;

      const updatedVoluntario = await strapi.entityService.update(
        "api::voluntario.voluntario",
        voluntario.id,
        {
          data: { nome, cidade, descricao, aceita_cachorro, aceita_gato, porte_maximo },
        }
      );

      return {
        voluntario: {
          id: updatedVoluntario.id,
          nome: updatedVoluntario.nome || "",
          email: updatedVoluntario.email || "",
          cidade: updatedVoluntario.cidade || "",
          descricao: updatedVoluntario.descricao || "",
          aceita_cachorro: updatedVoluntario.aceita_cachorro ?? false,
          aceita_gato: updatedVoluntario.aceita_gato ?? false,
          porte_maximo: updatedVoluntario.porte_maximo || "medio",
        },
      };
    } catch (err) {
      console.error("Erro ao atualizar voluntário:", err);
      return ctx.internalServerError(
        err.message || "Erro ao atualizar dados do voluntário."
      );
    }
  },
}));