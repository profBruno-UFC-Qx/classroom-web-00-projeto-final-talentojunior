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
        method: "POST",
        path: "/voluntarios/me/upload-profile-image",
        handler: "voluntario.uploadProfileImage",
        config: { auth: {} },
      },
      {
        method: "GET",
        path: "/voluntarios/me",
        handler: "voluntario.me",
        config: {
          auth: {},
        },
      },
      {
        method: "PUT",
        path: "/voluntarios/me",
        handler: "voluntario.updateMe",
        config: {
          auth: {},
        },
      },
    ],
  };