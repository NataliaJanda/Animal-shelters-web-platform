-- tables
-- Table: Adoption
CREATE TABLE Adoption (
                          id int  NOT NULL,
                          date int  NOT NULL,
                          description varchar(20)  NOT NULL,
                          User_id int  NOT NULL,
                          Animal_id int  NOT NULL,
                          CONSTRAINT Adoption_pk PRIMARY KEY (id)
);

-- Table: Animal
CREATE TABLE Animal (
                        id int  NOT NULL,
                        name varchar(20)  NOT NULL,
                        atitude varchar(30)  NOT NULL,
                        age int  NOT NULL,
                        Shelter_id int  NOT NULL,
                        CONSTRAINT Animal_pk PRIMARY KEY (id)
);

-- Table: Campaigns
CREATE TABLE Campaigns (
                           id int  NOT NULL,
                           Shelter_id int  NOT NULL,
                           description varchar(40)  NOT NULL,
                           start_date int  NOT NULL,
                           end_date int  NOT NULL,
                           goal int  NOT NULL,
                           CONSTRAINT Campaigns_pk PRIMARY KEY (id)
);

-- Table: News
CREATE TABLE News (
                      id int  NOT NULL,
                      Shelter_id int  NOT NULL,
                      description int  NOT NULL,
                      date int  NOT NULL,
                      CONSTRAINT News_pk PRIMARY KEY (id)
);

-- Table: Photo
CREATE TABLE Photo (
                       id int  NOT NULL,
                       data bytea  NOT NULL,
                       Animal_id int  NOT NULL,
                       CONSTRAINT Photo_pk PRIMARY KEY (id)
);

-- Table: Shelter
CREATE TABLE Shelter (
                         id int  NOT NULL,
                         name varchar(20)  NOT NULL,
                         address varchar(30)  NOT NULL,
                         description int  NOT NULL,
                         CONSTRAINT Shelter_pk PRIMARY KEY (id)
);

-- Table: Shelter_accounts
CREATE TABLE Shelter_accounts (
                                  id int  NOT NULL,
                                  name varchar(20)  NOT NULL,
                                  last_name varchar(20)  NOT NULL,
                                  email varchar(20)  NOT NULL,
                                  phone_number int  NOT NULL,
                                  password varchar(20)  NOT NULL,
                                  address varchar(20)  NOT NULL,
                                  Shelter_id int  NOT NULL,
                                  CONSTRAINT Shelter_accounts_pk PRIMARY KEY (id)
);

-- Table: Species
CREATE TABLE Species (
                         id int  NOT NULL,
                         name varchar(20)  NOT NULL,
                         amount int  NOT NULL,
                         Animal_id int  NOT NULL,
                         CONSTRAINT Species_pk PRIMARY KEY (id)
);

-- Table: User
CREATE TABLE Users (
                      id int  NOT NULL,
                      name varchar(20)  NOT NULL,
                      last_name varchar(20)  NOT NULL,
                      email varchar(20)  NOT NULL,
                      password varchar(20)  NOT NULL,
                      CONSTRAINT User_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: Adoption_Animal (table: Adoption)
ALTER TABLE Adoption ADD CONSTRAINT Adoption_Animal
    FOREIGN KEY (Animal_id)
        REFERENCES Animal (id)
        NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- Reference: Adoption_User (table: Adoption)
ALTER TABLE Adoption ADD CONSTRAINT Adoption_User
    FOREIGN KEY (User_id)
        REFERENCES Users (id)
        NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- Reference: Animal_Shelter (table: Animal)
ALTER TABLE Animal ADD CONSTRAINT Animal_Shelter
    FOREIGN KEY (Shelter_id)
        REFERENCES Shelter (id)
        NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- Reference: Campaigns_Shelter (table: Campaigns)
ALTER TABLE Campaigns ADD CONSTRAINT Campaigns_Shelter
    FOREIGN KEY (Shelter_id)
        REFERENCES Shelter (id)
        NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- Reference: News_Shelter (table: News)
ALTER TABLE News ADD CONSTRAINT News_Shelter
    FOREIGN KEY (Shelter_id)
        REFERENCES Shelter (id)
        NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- Reference: Photo_Animal (table: Photo)
ALTER TABLE Photo ADD CONSTRAINT Photo_Animal
    FOREIGN KEY (Animal_id)
        REFERENCES Animal (id)
        NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- Reference: Shelter_accounts_Shelter (table: Shelter_accounts)
ALTER TABLE Shelter_accounts ADD CONSTRAINT Shelter_accounts_Shelter
    FOREIGN KEY (Shelter_id)
        REFERENCES Shelter (id)
        NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- Reference: Species_Animal (table: Species)
ALTER TABLE Species ADD CONSTRAINT Species_Animal
    FOREIGN KEY (Animal_id)
        REFERENCES Animal (id)
        NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

