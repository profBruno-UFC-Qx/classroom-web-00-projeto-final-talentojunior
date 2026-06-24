'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::ong.ong', ({ strapi }) => ({
  async register(ctx) {
    const { nome, email, senha, confirmacaoSenha } = ctx.request.body;

    if (!nome || !email || !senha || !confirmacaoSenha) {
      return ctx.badRequest('Por favor, preencha todos os campos obrigatórios.');
    }

    if (senha !== confirmacaoSenha) {
      return ctx.badRequest('A senha e a confirmação de senha não coincidem.');
    }

    try {
      const emailLower = email.toLowerCase().trim();

      // Verifica se já existe usuário
      const userExists = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email: emailLower },
      });

      if (userExists) {
        return ctx.badRequest('Este e-mail já está cadastrado.');
      }

      // Busca a role authenticated
      const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' },
      });

      if (!defaultRole) {
        return ctx.internalServerError('Role authenticated não encontrada.');
      }

      // Cria o usuário do plugin
      const newUser = await strapi.entityService.create('plugin::users-permissions.user', {
        data: {
          username: emailLower,
          email: emailLower,
          password: senha,
          provider: 'local', // IMPORTANTE
          confirmed: true,
          blocked: false,
          role: defaultRole.id,
        },
      });

      // Cria a ONG vinculada ao usuário
      const newOng = await strapi.entityService.create('api::ong.ong', {
        data: {
          nome,
          user: newUser.id,
          publishedAt: new Date(),
        },
      });

      // Gera JWT
      const jwt = strapi.plugin('users-permissions').service('jwt').issue({
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
      console.error('===== ERRO AO REGISTRAR ONG =====');
      console.error(err);
      return ctx.internalServerError(err.message || 'Erro ao registrar a ONG.');
    }
  },
}));