import { closeConnection, getConnection, sql } from "../database/connection.js";
import { getProjectsQuery, getProjectByIdsQuery } from "../database/queries.js";
import { mapStringToArray } from "../utils.js";

export const getProjects = async (req, res) => {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool.request().query(getProjectsQuery);
    res.json(result.recordset.map(r => ({ ...r, Members: mapStringToArray(r.Members) })))
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
  finally {
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
    if (result.recordset.length == 0) {
      res.status(404);
      res.send("Resource not found");
      return;
    }
    let resource = result.recordset[0];
    resource = {
      ...resource,
      Technologies: mapStringToArray(resource.Technologies),
      OtherLinks: mapStringToArray(resource.OtherLinks).map(link => {
        const [key, value] = mapStringToArray(link, ': ');
        return { Name: key, Url: value };
      }),
      Members: mapStringToArray(resource.Members)
    }
    return res.json(resource);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
  finally {
    closeConnection(pool);
  }
};