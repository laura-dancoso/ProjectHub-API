import { closeConnection, getConnection } from "../database/connection.js";
import { getSubjectsQuery } from "../database/queries.js";

export const getSubjects = async (req, res) => {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool.request().query(getSubjectsQuery);
    let subjects = result.recordset;
    res.json(subjects)
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send(error.message);
  }
  finally {
    closeConnection(pool);
  }
};