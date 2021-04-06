import express from "express";

export const validator = (schema: any) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(406).send({
        field: error.details[0].context.label,
        msg: error.details[0].message,
      });
    } else {
      next();
    }
  };
};

export default {
  validator,
};
