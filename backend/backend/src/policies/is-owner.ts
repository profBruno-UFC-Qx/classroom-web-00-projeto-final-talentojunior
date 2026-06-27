export default async (policyContext, config, { strapi }) => {
    const user = policyContext.state.user;
    if (!user) return false;
  
    const { model, relationField } = config;
    const { id } = policyContext.params;
  
    const record = await strapi.entityService.findOne(model, id, {
      populate: [relationField],
    });
  
    if (!record) return false;
  
    const owner = (record as any)[relationField];
    return owner?.id === user.id;
  };