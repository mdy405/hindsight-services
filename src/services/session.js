import db from "../config/db.js";

export const getSessions = () => {
  return db.session.findAll({
    raw: true,
    order: [["expires", "DESC"]],
  });
};

export const createSession = ({ access, refresh, expires }) => {
  return db.session.create({
    access: access,
    refresh: refresh,
    expires: expires,
  });
};

export const removeSessions = async () => {
  return db.session.destroy({
    where: {},
    truncate: true,
  });
};
