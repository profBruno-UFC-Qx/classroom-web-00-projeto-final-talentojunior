export default {
    routes: [
      {
        method: "POST",
        path: "/voluntarios/register",
        handler: "voluntario.register",
        config: {
          auth: false,
        },
      },
      {
        method: "GET",
        path: "/voluntarios/me",
        handler: "voluntario.me",
        config: {
          policies: [],
        },
      },
      {
        method: "PUT",
        path: "/voluntarios/me",
        handler: "voluntario.updateMe",
        config: {
          policies: [],
        },
      },
    ],
  };