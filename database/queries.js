// Projects

export const getProjectsQuery = `
SELECT [ProjectId]
      ,[Title]
      ,[Members]
      ,[ProjectImageKey]
  FROM [ProjectHub11].[dbo].[ProjectsDashboardView]
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
  FROM [ProjectHub11].[dbo].[ProjectDetailView]
  WHERE ProjectId = @id
`;

// Degrees

export const getDegreesQuery = `
SELECT [DegreeId]
      ,[Name]
FROM [ProjectHub11].[dbo].[Degrees]
`;

// Subjects

export const getSubjectsQuery = `
SELECT [SubjectId]
      ,[Name]
FROM [ProjectHub11].[dbo].[Subjects]
`;
