import { factories } from "@strapi/strapi";

const { createCoreController } = factories;

async function atualizarStatus(strapi: any, ctx: any, aprovada: boolean) {
  const loggedUser = ctx.state.user;
  if (!loggedUser) return ctx.unauthorized("Usuário não autenticado.");

  const { id } = ctx.params;

  const ongs = await strapi.entityService.findMany("api::ong.ong", {
    filters: { user: { id: loggedUser.id } },
  });
  const ong = Array.isArray(ongs) ? ongs[0] : ongs;
  if (!ong) return ctx.forbidden("Apenas ONGs podem responder solicitações.");

  const solicitacao: any = await strapi.entityService.findOne("api::solicitacao.solicitacao", id, {
    populate: { animal: { populate: { ong: true } } },
  });

  if (!solicitacao || solicitacao.animal?.ong?.id !== ong.id) {
    return ctx.notFound("Solicitação não encontrada.");
  }

  await strapi.entityService.update("api::solicitacao.solicitacao", id, {
    data: {
      aprovada,
      finalizada: true,
      ...(aprovada ? {} : { animal: null }),
    },
  });

  if (aprovada && solicitacao.animal?.id) {
    await strapi.entityService.update("api::animal.animal", solicitacao.animal.id, {
      data: { disponivel: false },
    });
  }

  return ctx.send({ message: aprovada ? "Solicitação aprovada." : "Solicitação recusada." });
}

export default createCoreController("api::solicitacao.solicitacao", ({ strapi }) => ({
  
  async solicitar(ctx) {
    try {
      const loggedUser = ctx.state.user;
      if (!loggedUser) return ctx.unauthorized("Usuário não autenticado.");

      const voluntarios = await strapi.entityService.findMany("api::voluntario.voluntario", {
        filters: { users_permissions_user: { id: loggedUser.id } },
      });
      const voluntario = Array.isArray(voluntarios) ? voluntarios[0] : voluntarios;

      if (!voluntario) {
        return ctx.forbidden("Apenas voluntários podem solicitar acolhidas.");
      }

      const { animalId } = ctx.request.body;
      if (!animalId) {
        return ctx.badRequest("Informe o animal a ser solicitado.");
      }

      const animal: any = await strapi.entityService.findOne("api::animal.animal", animalId, {
        populate: { solicitacao: true },
      });

      if (!animal) {
        return ctx.notFound("Animal não encontrado.");
      }

      if (!animal.disponivel) {
        return ctx.badRequest("Este animal não está disponível para acolhida.");
      }

      if (animal.solicitacao) {
        return ctx.badRequest("Este animal já possui uma solicitação em andamento.");
      }

      const solicitacao = await strapi.entityService.create("api::solicitacao.solicitacao", {
        data: {
          finalizada: false,
          aprovada: false,
          animal: animalId,
          voluntario: voluntario.id,
          publishedAt: new Date(),
        },
      });

      return ctx.created({
        message: "Solicitação enviada com sucesso.",
        data: solicitacao,
      });
    } catch (err) {
      console.error("Erro ao criar solicitação:", err);
      return ctx.internalServerError(err.message || "Erro ao criar solicitação.");
    }
  },

  async minhas(ctx) {
    try {
      const loggedUser = ctx.state.user;
      if (!loggedUser) return ctx.unauthorized("Usuário não autenticado.");

      const voluntarios = await strapi.entityService.findMany("api::voluntario.voluntario", {
        filters: { users_permissions_user: { id: loggedUser.id } },
      });
      const voluntario = Array.isArray(voluntarios) ? voluntarios[0] : voluntarios;

      if (!voluntario) {
        return ctx.forbidden("Apenas voluntários podem ver suas solicitações.");
      }

      const solicitacoes = await strapi.entityService.findMany("api::solicitacao.solicitacao", {
        filters: { voluntario: { id: voluntario.id } },
        populate: { animal: { populate: { imagem_capa: true, ong: true } } },
        sort: { createdAt: "desc" },
      });

      return ctx.send({ solicitacoes, total: solicitacoes.length });
    } catch (err) {
      console.error("Erro ao buscar solicitações:", err);
      return ctx.internalServerError(err.message || "Erro ao buscar solicitações.");
    }
  },

  async pendentes(ctx) {
    try {
      const loggedUser = ctx.state.user;
      if (!loggedUser) return ctx.unauthorized("Usuário não autenticado.");

      const ongs = await strapi.entityService.findMany("api::ong.ong", {
        filters: { user: { id: loggedUser.id } },
      });
      const ong = Array.isArray(ongs) ? ongs[0] : ongs;

      if (!ong) {
        return ctx.forbidden("Apenas ONGs podem ver solicitações pendentes.");
      }

      const solicitacoes = await strapi.entityService.findMany("api::solicitacao.solicitacao", {
        filters: {
          finalizada: false,
          animal: { ong: { id: ong.id } },
        },
        populate: {
          animal: { populate: { imagem_capa: true } },
          voluntario: true,
        },
        sort: { createdAt: "desc" },
      });

      return ctx.send({ solicitacoes, total: solicitacoes.length });
    } catch (err) {
      console.error("Erro ao buscar solicitações pendentes:", err);
      return ctx.internalServerError(err.message || "Erro ao buscar solicitações.");
    }
  },

  async aprovar(ctx) {
    return atualizarStatus(strapi, ctx, true);
  },

  async recusar(ctx) {
    return atualizarStatus(strapi, ctx, false);
  },
}));
