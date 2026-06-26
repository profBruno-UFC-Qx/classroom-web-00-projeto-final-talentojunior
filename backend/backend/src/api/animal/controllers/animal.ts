/**
 * animal controller
 */

import { factories } from "@strapi/strapi";

const { createCoreController } = factories;

export default createCoreController("api::animal.animal", ({ strapi }) => ({
  async createAnimal(ctx) {
    try {
      const loggedUser = ctx.state.user;

      if (!loggedUser) {
        return ctx.unauthorized("Usuário não autenticado.");
      }

      const ongs = await strapi.entityService.findMany("api::ong.ong", {
        filters: {
          user: {
            id: loggedUser.id,
          },
        },
      });

      const ong = Array.isArray(ongs) ? ongs[0] : ongs;

      if (!ong) {
        return ctx.forbidden("Apenas ONGs podem cadastrar animais.");
      }

      const body = ctx.request.body;

      const parseJSON = (value: any) => {
        if (typeof value === "string") {
          try {
            return JSON.parse(value);
          } catch {
            return [];
          }
        }
        return Array.isArray(value) ? value : [];
      };

      const animal = await strapi.entityService.create("api::animal.animal", {
        data: {
          nome: body.nome,
          disponivel: body.disponivel === "true" || body.disponivel === true,
          sobre: body.sobre,
          idade: Number(body.idade) || 0,
          porte: body.porte,
          localizacao: body.localizacao,
          especie: body.especie,
          status_do_animal: body.status_do_animal,
          caracteristicas_do_animal: parseJSON(body.caracteristicas_do_animal),
          caracteristicas_gerais: parseJSON(body.caracteristicas_gerais),
          necessidades_especiais: parseJSON(body.necessidades_especiais),
          data_de_entrada: body.data_de_entrada || new Date(),
          data_de_acolhimento: body.data_de_acolhimento || null,
          data_solicitacao: body.data_solicitacao || null,
          ong: ong.id,
          publishedAt: new Date(),
        },
      });

      const files = ctx.request.files;

      if (files && Object.keys(files).length > 0) {
        try {
          if (files.imagem_capa) {
            const capaFile = Array.isArray(files.imagem_capa)
              ? files.imagem_capa[0]
              : files.imagem_capa;

            await strapi
              .plugin("upload")
              .service("upload")
              .upload({
                data: {
                  ref: "api::animal.animal",
                  refId: animal.id,
                  field: "imagem_capa",
                },
                files: capaFile,
              });
          }

          if (files.imagens) {
            const galleryFiles = Array.isArray(files.imagens)
              ? files.imagens
              : [files.imagens];

            for (const file of galleryFiles) {
              await strapi
                .plugin("upload")
                .service("upload")
                .upload({
                  data: {
                    ref: "api::animal.animal",
                    refId: animal.id,
                    field: "imagens",
                  },
                  files: file,
                });
            }
          }
        } catch (uploadError) {
          console.error("Erro ao fazer upload de imagens:", uploadError);
        }
      }

      const animalCompleto = await strapi.entityService.findOne(
        "api::animal.animal",
        animal.id,
        {
          populate: {
            imagem_capa: true,
            imagens: true,
            ong: true,
          },
        },
      );

      return ctx.created({
        message: "Animal cadastrado com sucesso.",
        data: animalCompleto,
      });
    } catch (err) {
      console.error("Erro ao criar animal:", err);
      return ctx.internalServerError(
        err.message || "Erro ao cadastrar animal.",
      );
    }
  },

  async findAnimals(ctx) {
    try {
      const loggedUser = ctx.state.user;

      if (!loggedUser) {
        return ctx.unauthorized("Usuário não autenticado.");
      }

      const ongs = await strapi.entityService.findMany("api::ong.ong", {
        filters: {
          user: {
            id: loggedUser.id,
          },
        },
      });

      const ong = Array.isArray(ongs) ? ongs[0] : ongs;

      if (!ong) {
        return ctx.forbidden("Apenas ONGs podem acessar seus animais.");
      }

      const animals = await strapi.entityService.findMany(
        "api::animal.animal",
        {
          filters: {
            ong: {
              id: ong.id,
            },
          },
          populate: {
            imagem_capa: true,
            imagens: true,
            solicitacao: true,
          },
          sort: {
            createdAt: "desc",
          },
        },
      );

      return ctx.send({
        animals,
        total: animals.length,
      });
    } catch (err) {
      console.error("Erro ao buscar animais da ONG:", err);
      return ctx.internalServerError(err.message || "Erro ao buscar animais.");
    }
  },

  async findOneAnimal(ctx) {
    try {
      const loggedUser = ctx.state.user;

      if (!loggedUser) {
        return ctx.unauthorized("Usuário não autenticado.");
      }

      const { id } = ctx.params;

      const ongs = await strapi.entityService.findMany("api::ong.ong", {
        filters: {
          user: {
            id: loggedUser.id,
          },
        },
      });

      const ong = Array.isArray(ongs) ? ongs[0] : ongs;

      if (!ong) {
        return ctx.forbidden("Apenas ONGs podem acessar animais.");
      }

      const animals = await strapi.entityService.findMany(
        "api::animal.animal",
        {
          filters: {
            id,
            ong: {
              id: ong.id,
            },
          },
          populate: {
            imagem_capa: true,
            imagens: true,
            ong: true,
            solicitacao: true,
          },
        },
      );

      const animal = Array.isArray(animals) ? animals[0] : animals;

      if (!animal) {
        return ctx.notFound("Animal não encontrado.");
      }

      return ctx.send({
        animal,
      });
    } catch (err) {
      console.error("Erro ao buscar animal:", err);
      return ctx.internalServerError(err.message || "Erro ao buscar animal.");
    }
  },

  async updateAnimal(ctx) {
    try {
      const loggedUser = ctx.state.user;

      if (!loggedUser) {
        return ctx.unauthorized("Usuário não autenticado.");
      }

      const { id } = ctx.params;

      const ongs = await strapi.entityService.findMany("api::ong.ong", {
        filters: {
          user: {
            id: loggedUser.id,
          },
        },
      });

      const ong = Array.isArray(ongs) ? ongs[0] : ongs;

      if (!ong) {
        return ctx.forbidden("Apenas ONGs podem editar animais.");
      }

      const animals = await strapi.entityService.findMany(
        "api::animal.animal",
        {
          filters: {
            id,
            ong: {
              id: ong.id,
            },
          },
        },
      );

      const animal = Array.isArray(animals) ? animals[0] : animals;

      if (!animal) {
        return ctx.notFound("Animal não encontrado.");
      }

      const body = ctx.request.body;

      const parseJSON = (value: any) => {
        if (typeof value === "string") {
          try {
            return JSON.parse(value);
          } catch {
            return [];
          }
        }
        return Array.isArray(value) ? value : [];
      };

      await strapi.entityService.update("api::animal.animal", animal.id, {
        data: {
          nome: body.nome,
          disponivel: body.disponivel === "true" || body.disponivel === true,
          sobre: body.sobre,
          idade: Number(body.idade) || 0,
          porte: body.porte,
          localizacao: body.localizacao,
          especie: body.especie,
          status_do_animal: body.status_do_animal,
          caracteristicas_do_animal: parseJSON(body.caracteristicas_do_animal),
          caracteristicas_gerais: parseJSON(body.caracteristicas_gerais),
          necessidades_especiais: parseJSON(body.necessidades_especiais),
          data_de_entrada: body.data_de_entrada || animal.data_de_entrada,
          data_de_acolhimento: body.data_de_acolhimento || null,
          data_solicitacao: body.data_solicitacao || null,
        },
      });

      const files = ctx.request.files;

      if (files && Object.keys(files).length > 0) {
        try {
          if (files.imagem_capa) {
            const capaFile = Array.isArray(files.imagem_capa)
              ? files.imagem_capa[0]
              : files.imagem_capa;

            await strapi
              .plugin("upload")
              .service("upload")
              .upload({
                data: {
                  ref: "api::animal.animal",
                  refId: animal.id,
                  field: "imagem_capa",
                },
                files: capaFile,
              });
          }

          if (files.imagens) {
            const galleryFiles = Array.isArray(files.imagens)
              ? files.imagens
              : [files.imagens];

            for (const file of galleryFiles) {
              await strapi
                .plugin("upload")
                .service("upload")
                .upload({
                  data: {
                    ref: "api::animal.animal",
                    refId: animal.id,
                    field: "imagens",
                  },
                  files: file,
                });
            }
          }
        } catch (uploadError) {
          console.error("Erro ao fazer upload de imagens:", uploadError);
        }
      }

      const updatedAnimal = await strapi.entityService.findOne(
        "api::animal.animal",
        animal.id,
        {
          populate: {
            imagem_capa: true,
            imagens: true,
            ong: true,
            solicitacao: true,
          },
        },
      );

      return ctx.send({
        message: "Animal atualizado com sucesso.",
        data: updatedAnimal,
      });
    } catch (err) {
      console.error("Erro ao atualizar animal:", err);
      return ctx.internalServerError(
        err.message || "Erro ao atualizar animal.",
      );
    }
  },

  async deleteAnimal(ctx) {
    try {
      const loggedUser = ctx.state.user;

      if (!loggedUser) {
        return ctx.unauthorized("Usuário não autenticado.");
      }

      const { id } = ctx.params;

      const ongs = await strapi.entityService.findMany("api::ong.ong", {
        filters: {
          user: {
            id: loggedUser.id,
          },
        },
      });

      const ong = Array.isArray(ongs) ? ongs[0] : ongs;

      if (!ong) {
        return ctx.forbidden("Apenas ONGs podem excluir animais.");
      }

      const animal: any = await strapi.entityService.findOne(
        "api::animal.animal",
        id,
        {
          populate: {
            imagem_capa: true,
            imagens: true,
          },
        },
      );

      if (!animal) {
        return ctx.notFound("Animal não encontrado.");
      }

      if (animal.imagem_capa?.id) {
        try {
          await strapi
            .plugin("upload")
            .service("upload")
            .remove(animal.imagem_capa);
        } catch (err) {
          console.error("Erro ao remover imagem de capa:", err);
        }
      }

      if (animal.imagens && Array.isArray(animal.imagens)) {
        for (const imagem of animal.imagens) {
          try {
            await strapi.plugin("upload").service("upload").remove(imagem);
          } catch (err) {
            console.error("Erro ao remover imagem da galeria:", err);
          }
        }
      }

      await strapi.entityService.delete("api::animal.animal", animal.id);

      return ctx.send({
        message: "Animal removido com sucesso.",
      });
    } catch (err) {
      console.error("Erro ao excluir animal:", err);
      return ctx.internalServerError(err.message || "Erro ao excluir animal.");
    }
  },
}));
