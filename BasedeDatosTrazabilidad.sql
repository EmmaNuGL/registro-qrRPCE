ALTER TABLE libros
ADD CONSTRAINT libros_estado_check
CHECK (estado IN ('EN_ARCHIVO', 'EN_USO', 'PERDIDO', 'BAJA'));
