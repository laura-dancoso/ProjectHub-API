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
  FROM [ProjectHub11].[dbo].[ProjectDetail]
  WHERE ProjectId = @id
`;