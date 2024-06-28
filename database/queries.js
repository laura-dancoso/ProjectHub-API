// Projects

export const getProjectsQuery = `
SELECT [ProjectId]
      ,[Title]
      ,[Members]
      ,[ProjectImageKey]
  FROM [dbo].[ProjectsDashboardView]
`;

export const getProjectByIdsQuery = `
SELECT [ProjectId]
      ,[Title]
      ,[Description]
      ,[CreationDate]
      ,[Technologies]
      ,[RepoUrl]
      ,[OtherLinks]
      ,[DegreeName]
      ,[SubjectName]
      ,[ProfessorName]
      ,[Members]
      ,[ProjectUrl]
      ,[ProjectImageKeys]
  FROM [dbo].[ProjectDetailView]
  WHERE ProjectId = @id
`;

// Degrees

export const getDegreesQuery = `
SELECT [DegreeId]
      ,[Name]
FROM [dbo].[Degrees]
`;

// Subjects

export const getSubjectsQuery = `
SELECT [SubjectId]
      ,[Name]
FROM [dbo].[Subjects]
`;
