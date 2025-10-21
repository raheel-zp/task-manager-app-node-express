export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.details.map((d) => ({
          field: d.path[0],
          message: d.message,
        })),
      });
    }
    next();
  };
};
