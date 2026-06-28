"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/solicitacoes/solicitar",
      handler: "solicitacao.solicitar",
      config: {
        policies: [],
        auth: {},
      },
    },
    {
      method: "GET",
      path: "/solicitacoes/minhas",
      handler: "solicitacao.minhas",
      config: {
        policies: [],
        auth: {},
      },
    },
    {
      method: "GET",
      path: "/solicitacoes/pendentes",
      handler: "solicitacao.pendentes",
      config: { policies: [], auth: {} },
    },
    {
      method: "PUT",
      path: "/solicitacoes/:id/aprovar",
      handler: "solicitacao.aprovar",
      config: { policies: [], auth: {} },
    },
    {
      method: "PUT",
      path: "/solicitacoes/:id/recusar",
      handler: "solicitacao.recusar",
      config: { policies: [], auth: {} },
    },
  ],
};