"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/animals/me",
      handler: "animal.createAnimal",
      config: {
        policies: [],
        auth: {},
      },
    },
    {
      method: "GET",
      path: "/animals/disponiveis",
      handler: "animal.findDisponiveis",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/animals/me",
      handler: "animal.findAnimals",
      config: {
        policies: [],
        auth: {},
      },
    },
    {
      method: "GET",
      path: "/animals/:id/me",
      handler: "animal.findOneAnimal",
      config: {
        policies: [],
        auth: {},
      },
    },
    {
      method: "PUT",
      path: "/animals/:id/me",
      handler: "animal.updateAnimal",
      config: {
        policies: [],
        auth: {},
      },
    },
    {
      method: "DELETE",
      path: "/animals/:id/me",
      handler: "animal.deleteAnimal",
      config: {
        policies: [],
        auth: {},
      },
    },
  ],
};
