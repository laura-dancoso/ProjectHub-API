import { closeConnection, getConnection } from "../database/connection.js";
import { getDegreesQuery } from "../database/queries.js";

export const getDegrees = async (req, res) => {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool.request().query(getDegreesQuery);
    let degrees = result.recordset;
    res.json(degrees)
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send(error.message);
  }
  finally {
    closeConnection(pool);
  }
};