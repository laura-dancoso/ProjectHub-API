CREATE DATABASE ProjectHub11;
GO

USE ProjectHub11;
GO

-- Tables
CREATE TABLE dbo.Roles (
    RoleId INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL
);

CREATE TABLE dbo.Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    UserName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    RoleId INT,
    CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES dbo.Roles(RoleId)
);

CREATE TABLE dbo.Degrees (
    DegreeId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL
);

CREATE TABLE dbo.Subjects (
    SubjectId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    DegreeId INT,
    CONSTRAINT FK_Subjects_Degrees FOREIGN KEY (DegreeId) REFERENCES dbo.Degrees(DegreeId)
);

CREATE TABLE dbo.Projects (
    ProjectId INT PRIMARY KEY IDENTITY(1,1),
    SubjectId INT,
    ProfessorId INT,
    Description NVARCHAR(MAX) NOT NULL,
    CreationDate DATE NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    ShortDescription NVARCHAR(255),
    RepoUrl NVARCHAR(255) NULL,
    ProjectUrl NVARCHAR(255) NULL,
    CONSTRAINT FK_Projects_Subjects FOREIGN KEY (SubjectId) REFERENCES dbo.Subjects(SubjectId),
    CONSTRAINT FK_Projects_Users FOREIGN KEY (ProfessorId) REFERENCES dbo.Users(UserId)
);

CREATE TABLE dbo.ProjectMembers (
    ProjectId INT,
    MemberId INT,
    CONSTRAINT FK_ProjectMembers_Projects FOREIGN KEY (ProjectId) REFERENCES dbo.Projects(ProjectId),
    CONSTRAINT FK_ProjectMembers_Users FOREIGN KEY (MemberId) REFERENCES dbo.Users(UserId),
    PRIMARY KEY (ProjectId, MemberId)
);

CREATE TABLE dbo.Technologies (
    TechnologyId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL
);

CREATE TABLE dbo.ProjectTechnologies (
    ProjectId INT,
    TechnologyId INT,
    CONSTRAINT FK_ProjectTechnologies_Projects FOREIGN KEY (ProjectId) REFERENCES dbo.Projects(ProjectId),
    CONSTRAINT FK_ProjectTechnologies_Technologies FOREIGN KEY (TechnologyId) REFERENCES dbo.Technologies(TechnologyId),
    PRIMARY KEY (ProjectId, TechnologyId)
);

CREATE TABLE dbo.Links (
    LinkId INT PRIMARY KEY IDENTITY(1,1),
    ProjectId INT,
    Url NVARCHAR(255) NOT NULL,
    Description NVARCHAR(255),
    CONSTRAINT FK_Links_Projects FOREIGN KEY (ProjectId) REFERENCES dbo.Projects(ProjectId)
);

CREATE TABLE CoverImages (
    ImageId INT IDENTITY(1,1) PRIMARY KEY,
    ProjectId INT,
    ImageKey NVARCHAR(255) NOT NULL,
    CONSTRAINT FK_ProjectCoverImages_Projects FOREIGN KEY (ProjectId) 
        REFERENCES Projects (ProjectId)
        ON DELETE CASCADE
);

-- Views

CREATE VIEW [dbo].[ProjectDetail] AS
WITH DistinctTechnologies AS (
    SELECT
        p.ProjectId,
        STRING_AGG(t.Name, ';') AS Technologies
    FROM
        dbo.Projects p
        LEFT JOIN dbo.ProjectTechnologies pt ON p.ProjectId = pt.ProjectId
        LEFT JOIN dbo.Technologies t ON pt.TechnologyId = t.TechnologyId
    GROUP BY
        p.ProjectId
),
DistinctLinks AS (
    SELECT
        p.ProjectId,
        STRING_AGG(l.Description + ': ' + l.Url, ';') AS OtherLinks
    FROM
        dbo.Projects p
        LEFT JOIN dbo.Links l ON p.ProjectId = l.ProjectId
    GROUP BY
        p.ProjectId
),
DistinctMembers AS (
    SELECT
        p.ProjectId,
        STRING_AGG(pmem.UserName, ';') AS Members
    FROM
        dbo.Projects p
        LEFT JOIN dbo.ProjectMembers pm ON p.ProjectId = pm.ProjectId
        LEFT JOIN dbo.Users pmem ON pm.MemberId = pmem.UserId
    GROUP BY
        p.ProjectId
),
CoverImages AS (
    SELECT
        p.ProjectId,
        STRING_AGG(ci.ImageKey, ';') AS ImageKeys
    FROM
        dbo.Projects p
        LEFT JOIN dbo.CoverImages ci ON p.ProjectId = ci.ProjectId
    GROUP BY
        p.ProjectId
)
SELECT
    p.ProjectId,
    p.Title,
    p.Description,
    p.CreationDate,
    dt.Technologies,
    p.RepoUrl,
    dl.OtherLinks,
    d.Name AS DegreeName,
    s.Name AS SubjectName,
    u.UserName AS ProfessorName,
    dm.Members,
    ci.ImageKeys as ProjectImageKeys,
    p.ProjectUrl
FROM
    dbo.Projects p
    LEFT JOIN dbo.Subjects s ON p.SubjectId = s.SubjectId
    LEFT JOIN dbo.Degrees d ON s.DegreeId = d.DegreeId
    LEFT JOIN dbo.Users u ON p.ProfessorId = u.UserId
    LEFT JOIN DistinctTechnologies dt ON p.ProjectId = dt.ProjectId
    LEFT JOIN DistinctLinks dl ON p.ProjectId = dl.ProjectId
    LEFT JOIN DistinctMembers dm ON p.ProjectId = dm.ProjectId
    LEFT JOIN CoverImages ci ON p.ProjectId = ci.ProjectId;
GO

CREATE VIEW [dbo].[ProjectsDashboardView] AS
SELECT
    p.ProjectId,
    p.Title,
    STRING_AGG(u.UserName, ';') AS Members,
    p.ProjectImageKey
FROM
    dbo.Projects p
    LEFT JOIN dbo.ProjectMembers pm ON p.ProjectId = pm.ProjectId
    LEFT JOIN dbo.Users u ON pm.MemberId = u.UserId
GROUP BY
    p.ProjectId,
    p.Title,
    p.ProjectImageKey;

GO