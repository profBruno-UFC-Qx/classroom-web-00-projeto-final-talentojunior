import { factories } from "@strapi/strapi";
const { createCoreRouter } = factories;

export default createCoreRouter("api::voluntario.voluntario", {
  config: {
    update: {
      policies: [
        {
          name: "global::is-owner",
          config: { model: "api::voluntario.voluntario", relationField: "users_permissions_user" },
        },
      ],
    },
    delete: {
      policies: [
        {
          name: "global::is-owner",
          config: { model: "api::voluntario.voluntario", relationField: "users_permissions_user" },
        },
      ],
    },
  },
});
