USE ProjectHub11;
GO
-- Insertar roles iniciales
INSERT INTO dbo.Roles (RoleName) VALUES ('Admin'), ('Professor'), ('Student');

-- Insertar usuarios iniciales
INSERT INTO dbo.Users (UserName, Email, Password, RoleId) VALUES 
('admin', 'admin@example.com', 'password133', 1); -- Admin

-- Insertar grados iniciales
INSERT INTO dbo.Degrees (Name) VALUES 
('Desarrollo de Software'), 
('Ciencia de datos');

-- Insertar materias iniciales
INSERT INTO dbo.Subjects (Name) VALUES 
('Modelado de datos'), 
('Base de Datos'), 
('Gestión');

-- Insertar proyectos iniciales
INSERT INTO dbo.Projects (SubjectId,DegreeId, ProfessorName, Description, CreationDate, Title, ShortDescription, RepoUrl, ProjectUrl, Members) VALUES
(1, 1, 'Nahuel González', 'Descripción del proyecto 1', '2024-01-01', 'Proyecto 1', 'Breve descripción del proyecto 1', 'http://github.com/proyecto1', 'http://proyecto1.com', 'Gonzalo; Mauro; Furia'),
(1, 1, 'Nahuel González', 'Descripción del proyecto 2', '2024-02-01', 'Proyecto 2', 'Breve descripción del proyecto 2', 'http://github.com/proyecto2', 'http://proyecto2.com', 'Gonzalo; Mauro; Furia'),
(2, 1, 'Nahuel González', 'Descripción del proyecto 3', '2024-03-01', 'Proyecto 3', 'Breve descripción del proyecto 3', 'http://github.com/proyecto3', 'http://proyecto3.com', 'Gonzalo; Mauro; Furia'),
(2, 1, 'Nahuel González', 'Descripción del proyecto 4', '2024-04-01', 'Proyecto 4', 'Breve descripción del proyecto 4', 'http://github.com/proyecto4', 'http://proyecto4.com', 'Gonzalo; Mauro; Furia'),
(1, 1, 'Nahuel González', 'Descripción del proyecto 5', '2024-05-01', 'Proyecto 5', 'Breve descripción del proyecto 5', 'http://github.com/proyecto5', 'http://proyecto5.com', 'Gonzalo; Mauro; Furia'),
(2, 1, 'Nahuel González', 'Descripción del proyecto 6', '2024-06-01', 'Proyecto 6', 'Breve descripción del proyecto 6', 'http://github.com/proyecto6', 'http://proyecto6.com', 'Gonzalo; Mauro; Furia');

-- Insertar tecnologías iniciales
INSERT INTO dbo.Technologies (Name) VALUES
('Python'),
('JavaScript'),
('SQL'),
('Java'),
('C++'),
('HTML/CSS');

-- Insertar tecnologías en proyectos iniciales
INSERT INTO dbo.ProjectTechnologies (ProjectId, TechnologyId) VALUES
(1, 1), (1, 2), -- Proyecto 1 usa Python y JavaScript
(2, 2), (2, 3), -- Proyecto 2 usa JavaScript y SQL
(3, 4),         -- Proyecto 3 usa Java
(4, 5),         -- Proyecto 4 usa C++
(5, 1), (5, 6), -- Proyecto 5 usa Python y HTML/CSS
(6, 3), (6, 4); -- Proyecto 6 usa SQL y Java

-- Insertar links iniciales
INSERT INTO dbo.Links (ProjectId, Url, Description) VALUES
(1, 'http://proyecto1.com/link1', 'Link 1 al proyecto 1'),
(1, 'http://proyecto1.com/link13', 'Link 2 al proyecto 1'),
(2, 'http://proyecto2.com/link2', 'Link 1 al proyecto 2'),
(2, 'http://proyecto2.com/link22', 'Link 2 al proyecto 2'),
(3, 'http://proyecto3.com/link3', 'Link al proyecto 3'),
(3, 'http://proyecto3.com/link3', 'Link al proyecto 3'),
(4, 'http://proyecto4.com/link4', 'Link al proyecto 4'),
(5, 'http://proyecto5.com/link5', 'Link al proyecto 5'),
(6, 'http://proyecto6.com/link6', 'Link al proyecto 6');

--- insertar cover images
  INSERT INTO dbo.CoverImages (ProjectId, ImageKey)
  VALUES
  (1, 'covers/1.jpg'),
  (1, 'covers/2.png'),
  (3, 'covers/3.png'),
  (4, 'covers/4.png'),
  (5, 'covers/5.png'),
  (6, 'covers/6.png'),
  (1, 'covers/7.png'),
  (2, 'covers/8.png');