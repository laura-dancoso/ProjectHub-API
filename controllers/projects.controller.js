import { closeConnection, getConnection, sql } from "../database/connection.js";
import { getProjectsQuery, getProjectByIdsQuery} from "../database/queries.js";

export const getProjects = async (req, res) => {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool.request().query(getProjectsQuery);
    res.json(result.recordset.map(r=>({...r, Members: r.Members?.split(';') || []})))
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
  finally{
    closeConnection(pool);
  }
};

export const getProjectById = async (req, res) => {
  let pool;
  try {
    pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query(getProjectByIdsQuery);
    if(result.recordset.length == 0){
      res.status(404);
      res.send("Resource not found");
      return;
    }
    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
  finally{
    closeConnection(pool);
  }
};