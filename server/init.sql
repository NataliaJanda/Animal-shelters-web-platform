-- tables
-- Table: Adoption
CREATE TABLE Adoption (
                          id SERIAL PRIMARY KEY,
                          date timestamp(6)  NOT NULL,
                          description varchar(250)  NOT NULL,
                          User_id int,
                          Shelter_id int,
                          Animal_id int
);

-- Table: Animal
CREATE TABLE Animal (
                        id SERIAL PRIMARY KEY,
                        name varchar(20)  NOT NULL,
                        atitude varchar(250)  NOT NULL,
                        description varchar(1000)  NOT NULL,
                        sex varchar(40) NOT NULL,
                        size varchar(40) NOT NULL,
                        race varchar(40) NOT NULL,
                        vaccination boolean NOT NULL,
                        age int  NOT NULL,
                        Shelter_id int ,
                        Species_id int
);

-- Table: Campaigns
CREATE TABLE Campaigns (
                           id SERIAL PRIMARY KEY,
                           Shelter_id int,
                           title varchar(20) NOT NULL,
                           description varchar(250)  NOT NULL,
                           start_date timestamp(6)  NOT NULL,
                           end_date timestamp(6)  NOT NULL,
                           goal varchar(40)  NOT NULL
);

-- Table: News
CREATE TABLE News (
                      id SERIAL PRIMARY KEY,
                      title varchar(30) NOT NULL,
                      Shelter_id int,
                      description varchar(250)  NOT NULL,
                      date timestamp(6)  NOT NULL
);

-- Table: Photo
CREATE TABLE Photo (
                       id SERIAL PRIMARY KEY,
                       data smallint  NOT NULL,
                       Animal_id int
);

-- Table: Shelter
CREATE TABLE Shelter (
                         id SERIAL PRIMARY KEY,
                         name varchar(20)  NOT NULL,
                         address varchar(30)  NOT NULL,
                         description varchar(60),
                         commune varchar(150) NOT NULL,
                         post_code varchar(20) NOT NULL,
                         town varchar(100) NOT NULL,
                         county varchar(100) NOT NULL,
                         real_estate_number varchar(100) NOT NULL,
                         regon varchar(100) NOT NULL,
                         voivodeship varchar(100) NOT NULL
);

-- Table: Shelter_accounts
CREATE TABLE Shelter_accounts (
                                  id SERIAL PRIMARY KEY,
                                  username varchar(100) NOT NULL,
                                  name varchar(100)  NOT NULL,
                                  last_name varchar(100)  NOT NULL,
                                  email varchar(40)  NOT NULL,
                                  phone_number varchar(20)  NOT NULL,
                                  role varchar(10) NOT NULL,
                                  password varchar(100)  NOT NULL,
                                  Shelter_id int,
                                  activated boolean NOT NULL,
                                  verification_code varchar(200),
                                  expired timestamp(6)
);

-- Table: Species
CREATE TABLE Species (
                         id SERIAL PRIMARY KEY,
                         name varchar(20),
                         amount int
);

-- Table: User
CREATE TABLE Users (
                       id SERIAL PRIMARY KEY,
                       username varchar(100) NOT NULL,
                       name varchar(100)  NOT NULL,
                       last_name varchar(100)  NOT NULL,
                       email varchar(100)  NOT NULL,
                       role varchar(100) NOT NULL,
                       password varchar(100)  NOT NULL,
                       activated boolean NOT NULL,
                       verification_code varchar(200),
                       expired timestamp(6)
);

CREATE TABLE Orders (
                       id SERIAL PRIMARY KEY,
                       Shelter_id int NOT NULL,
                       date timestamp(6) NOT NULL,
                       name varchar(100) NOT NULL,
                       count int NOT NULL,
                       link varchar(500) NOT NULL,
                       info varchar(500) NOT NULL,
                       active boolean NOT NULL,
                       isPublic boolean NOT NULL,
                       FOREIGN KEY (shelter_id) REFERENCES Shelter(id)
);

CREATE TABLE OrderContributions (
                        id SERIAL PRIMARY KEY,
                        order_id INT NOT NULL,
                        shelter_id INT NOT NULL,
                        quantity INT NOT NULL,
                        date TIMESTAMP(6) NOT NULL,
                        message varchar(500),
                        FOREIGN KEY (order_id) REFERENCES Orders(id),
                        FOREIGN KEY (shelter_id) REFERENCES Shelter(id)
);

INSERT INTO Species (name,amount) VALUES ('Dog',0);
INSERT INTO Species (name,amount) VALUES ('Cat',0);
INSERT INTO Species (name,amount) VALUES ('Rabbit',0);

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

ALTER TABLE Adoption ADD CONSTRAINT Adoption_Shelter
    FOREIGN KEY (Shelter_id)
        REFERENCES Shelter (id)
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
ALTER TABLE Animal ADD CONSTRAINT Animal_Species
    FOREIGN KEY (Species_id)
        REFERENCES Species (id)
        NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

