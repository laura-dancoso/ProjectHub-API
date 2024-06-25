import { BUCKET_COVERS_FILE, BUCKET_PROJECTS_FILE } from "../config.js";
import { closeConnection, getConnection, sql } from "../database/connection.js";
import { getProjectsQuery, getProjectByIdsQuery } from "../database/queries.js";
import { mapStringToArray } from "../utils.js";
import { getImgtUrl, postImage, deleteImage } from './s3.controller.js'

export const getProjects = async (req, res) => {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool.request().query(getProjectsQuery);
    let projects = result.recordset.map(r => ({ ...r, Members: mapStringToArray(r.Members) }));
    for (let p of projects) {
      p.ProjectImgUrl = await getImgtUrl(p.ProjectImageKey)
    }
    res.json(projects)
  } catch (error) {
    console.error(error);
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
      Members: mapStringToArray(resource.Members),
      ProjectImgUrls: []
    };
    for (let p of mapStringToArray(resource.ProjectImageKeys)) {
      let projectImgUrl = await getImgtUrl(p);
      resource.ProjectImgUrls.push(projectImgUrl);
    }
    return res.json(resource);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send(error.message);
  }
  finally {
    closeConnection(pool);
  }
};

export const createNewProject = async (req, res) => {
  const {
    title,
    description,
    creationDate,
    shortDescription,
    repoUrl,
    projectUrl,
    subjectId,
    degreeId,
    professorName,
    members,
    links, // url y description
    technologies, // puede tener el id o el name - si tiene el id se relaciona directamente agrega directamente, sino se debe crear primero
  } = req.body;

  if (title == null || description == null || creationDate == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all required fields" });
  }

  // subir las imágenes a s3

  const projectImageKey = req?.files?.project ? await postImage(req?.files?.project[0], BUCKET_PROJECTS_FILE) : null;
  const coverImages = [];

  for (let i = 0; i < req?.files?.covers?.length || 0; i++) {
    const file = req?.files?.covers[i];
    const fileImageKey = await postImage(file, BUCKET_COVERS_FILE) ?? null;
    coverImages.push(fileImageKey);
  }


  let pool;
  try {
    pool = await getConnection();

    const transaction = pool.transaction()

    try {
      await transaction.begin();

      const request = transaction.request();

      // create project
      const projectResult = await request
        .input("title", sql.NVarChar, title)
        .input("Description", sql.NVarChar, description)
        .input("ShortDescription", sql.NVarChar, shortDescription)
        .input("SubjectId", sql.Int, subjectId)
        .input("DegreeId", sql.Int, degreeId)
        .input("ProfessorName", sql.NVarChar, professorName)
        .input("CreationDate", new Date())
        .input("RepoUrl", sql.NVarChar, repoUrl)
        .input("ProjectUrl", sql.NVarChar, projectUrl)
        .input("Members", sql.NVarChar, members)
        .input("ProjectImageKey", sql.NVarChar, projectImageKey)
        .batch(
          "INSERT INTO dbo.Projects (SubjectId, DegreeId, ProfessorName, Description, CreationDate, Title, ShortDescription, RepoUrl, ProjectUrl, Members, ProjectImageKey) " +
          "VALUES (@SubjectId, @DegreeId, @ProfessorName, @Description, @CreationDate, @Title, @ShortDescription, @RepoUrl, @ProjectUrl, @Members, @ProjectImageKey); SELECT SCOPE_IDENTITY() as id"
        );

      // links
      for (let i = 0; i < links?.length || 0; i++) {
        const parameterProjectIdName = `LinkProjectId${i}`
        const parameterUrlName = `LinkUrl${i}`
        const parameterDescriptionName = `LinkDescription${i}`
        const link = links[i];
        const linkResult = await request
          .input(parameterProjectIdName, projectResult.recordset[0].id)
          .input(parameterUrlName, link.url)
          .input(parameterDescriptionName, link.description)
          .batch("INSERT INTO dbo.Links (ProjectId, Url, Description) " +
            `VALUES (@${parameterProjectIdName}, @${parameterUrlName}, @${parameterDescriptionName}); SELECT SCOPE_IDENTITY() as id`
          );

      }

      // technologies
      for (let i = 0; i < technologies?.length || 0; i++) {
        const parameterProjectId = `TechnologyProjectId${i}`
        const parameterName = `TechnologyName${i}`
        const technology = technologies[i];
        let technologyIdResult = await request
          .input(parameterName, technology)
          .batch(`SELECT TechnologyId as id FROM dbo.Technologies WHERE Name = @${parameterName}`);
        if (!(technologyIdResult.recordset[0])) {
          technologyIdResult = await request
            .batch(`INSERT INTO dbo.Technologies (Name) VALUES (@${parameterName}); SELECT SCOPE_IDENTITY() as id`);

        }
        const parameterTechnologyId = `TechnologyId${i}`;
        const technologiesResult = await request
          .input(parameterProjectId, projectResult.recordset[0].id)
          .input(parameterTechnologyId, technologyIdResult.recordset[0].id)
          .batch(`
            IF NOT EXISTS (
                SELECT 1
                FROM dbo.ProjectTechnologies
                WHERE ProjectId = @${parameterProjectId} AND TechnologyId = @${parameterTechnologyId}
            )
            BEGIN
                INSERT INTO dbo.ProjectTechnologies (ProjectId, TechnologyId)
                VALUES (@${parameterProjectId}, @${parameterTechnologyId});
            END
            `);
      }

      // coverImages
      for (let i = 0; i < coverImages?.length || 0; i++) {
        const parameterProjectId = `CoverProjectId${i}`;
        const parameterImgKey = `ImageKey${i}`;

        const result = await request
          .input(parameterProjectId, projectResult.recordset[0].id)
          .input(parameterImgKey, coverImages[i])
          .batch(`
                INSERT INTO dbo.CoverImages (ProjectId, ImageKey)
                VALUES (@${parameterProjectId}, @${parameterImgKey});
            `);
      }

      await transaction.commit();
      res.status(200);
      res.json({
        id: projectResult.recordset[0].id,
      });
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      res.status(500);
      res.send(error.message);
    }

  } catch (error) {
    console.error(error);
    res.status(500);
    res.send(error.message);
  }
  finally {
    closeConnection(pool);
  }
};

export const deleteProjectById = async (req, res) => {
  let pool;
  try {
    pool = await getConnection();
    const transaction = pool.transaction()

    try {

      await transaction.begin();

      const request = transaction.request().input("ProjectId", req.params.id);
      const projectResult = await request.batch(`SELECT ProjectId as id FROM dbo.Projects WHERE ProjectId = @ProjectId;`);
      if (projectResult.recordset.length == 0) {
        res.status(404);
        res.send("Resource not found");
        return;
      }

      let imageKeys = [];

      const queries = [
        `SELECT ProjectImageKey as ImageKey FROM dbo.Projects WHERE ProjectId = @ProjectId;`,
        `SELECT ImageKey FROM dbo.CoverImages WHERE ProjectId = @ProjectId;`,
        `DELETE FROM dbo.ProjectTechnologies WHERE ProjectId = @ProjectId;`,
        `DELETE FROM dbo.Links WHERE ProjectId = @ProjectId;`,
        `DELETE FROM dbo.CoverImages WHERE ProjectId = @ProjectId;`,
        `DELETE FROM dbo.Projects WHERE ProjectId = @ProjectId;`
      ];
      for (let i = 0; i < queries.length; i++) {
        let query = queries[i];
        const result = await request.batch(query);
        if(i<2){
          imageKeys = imageKeys.concat(result.recordset.map(i=>i.ImageKey));
        }
      }

      for (let i = 0; i < imageKeys.length || 0; i++) {
        await deleteImage(imageKeys[i]);
      }
      
      await transaction.commit();
      res.sendStatus(204);
    } catch(error) {
      console.error(error);
      await transaction.rollback();
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send(error.message);
  }
  finally {
    closeConnection(pool);
  }
}

export const updateProjectById = async (req, res) => {
  const projectId = req.params.id;
  if (projectId == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all required fields" });
  }
  const {
    title,
    description,
    creationDate,
    shortDescription,
    repoUrl,
    projectUrl,
    subjectId,
    degreeId,
    professorName,
    members
  } = req.body;

  let pool;
  try {
    pool = await getConnection();

    const transaction = pool.transaction()

    try {
      await transaction.begin();

      const request = transaction.request();

      let updateQuery = [];
      if (title) {
        updateQuery.push(`Title = @Title`);
      }
      if (description) {
        updateQuery.push(`Description = @Description`);
      }
      if (shortDescription) {
        updateQuery.push(`ShortDescription = @ShortDescription`);
      }
      if (subjectId) {
        updateQuery.push(`SubjectId = @SubjectId`);
      }
      if (degreeId) {
        updateQuery.push(`DegreeId = @DegreeId`);
      }
      if (professorName) {
        updateQuery.push(`ProfessorName = @ProfessorName`);
      }
      if (creationDate) {
        updateQuery.push(`CreationDate = @CreationDate`);
      }
      if (repoUrl) {
        updateQuery.push(`RepoUrl = @RepoUrl`);
      }
      if (projectUrl) {
        updateQuery.push(`ProjectUrl = @ProjectUrl`);
      }
      if (members) {
        updateQuery.push(`Members = @Members`);
      }
      const query = `
      UPDATE dbo.Projects SET ${updateQuery.join(', ')} WHERE ProjectId = @ProjectId;
      `;

      // update project
      const projectResult = await request
        .input("ProjectId", sql.Int, projectId)
        .input("Title", sql.NVarChar, title)
        .input("Description", sql.NVarChar, description)
        .input("ShortDescription", sql.NVarChar, shortDescription)
        .input("SubjectId", sql.Int, subjectId)
        .input("DegreeId", sql.Int, degreeId)
        .input("ProfessorName", sql.NVarChar, professorName)
        .input("CreationDate", new Date())
        .input("RepoUrl", sql.NVarChar, repoUrl)
        .input("ProjectUrl", sql.NVarChar, projectUrl)
        .input("Members", sql.NVarChar, members)
        .batch(query);

      await transaction.commit();
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      res.status(500);
      res.send(error.message);
    }

  } catch (error) {
    console.error(error);
    res.status(500);
    res.send(error.message);
  }
  finally {
    closeConnection(pool);
  }
};