import { factories } from "@strapi/strapi";
const { createCoreRouter } = factories;

export default createCoreRouter("api::ong.ong", {
  config: {
    update: {
      policies: [
        {
          name: "global::is-owner",
          config: { model: "api::ong.ong", relationField: "user" },
        },
      ],
    },
    delete: {
      policies: [
        {
          name: "global::is-owner",
          config: { model: "api::ong.ong", relationField: "user" },
        },
      ],
    },
  },
});