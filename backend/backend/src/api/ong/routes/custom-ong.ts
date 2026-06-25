"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/ong/register",
      handler: "ong.register",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/ong/me",
      handler: "ong.me",
      config: {
        auth: {},
      },
    },
    {
      method: "PUT",
      path: "/ong/me",
      handler: "ong.updateMe",
      config: {
        auth: {},
      },
    },
    {
      method: "POST",
      path: "/ong/me/upload-profile-image",
      handler: "ong.uploadProfileImage",
      config: {
        auth: {},
      },
    }
  ],
};
