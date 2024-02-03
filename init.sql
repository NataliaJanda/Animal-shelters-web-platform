
CREATE TABLE Shelter (
                         id int  NOT NULL,
                         name int  NOT NULL,
                         CONSTRAINT Shelter_pk PRIMARY KEY (id)
);

-- Table: animal
CREATE TABLE animal (
                        id int  NOT NULL,
                        name char(12)  NOT NULL,
                        Shelter_id int  NOT NULL,
                        CONSTRAINT animal_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: animal_Shelter (table: animal)
ALTER TABLE animal ADD CONSTRAINT animal_Shelter
    FOREIGN KEY (Shelter_id)
        REFERENCES Shelter (id)
        NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- End of file.