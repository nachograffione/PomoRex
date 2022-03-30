-- CREATE DATABASE pomoRex;


CREATE TABLE category (
    catId      SERIAL,     -- == INT NOT NULL
	catName    CHAR(30) NOT NULL,

    CONSTRAINT pk_category      PRIMARY KEY (catId),
    CONSTRAINT ak_category      UNIQUE (catName)
);


CREATE TABLE subcategory (
    subcId          SERIAL,     -- == INT NOT NULL
	subcName        CHAR(30) NOT NULL,
    subcIdCategory  INT NOT NULL,

    CONSTRAINT pk_subcategory              PRIMARY KEY (subcId),
    CONSTRAINT ak_subcategory              UNIQUE (subcName, subcIdCategory),
    CONSTRAINT fk_subsubcategory_category  FOREIGN KEY (subcIdCategory)
        REFERENCES category (catId)
);
CREATE INDEX fk_subcategory_category_index
    ON subcategory(subcIdCategory);


CREATE TABLE pomo (
    pomId              SERIAL,     -- == INT NOT NULL
	pomDate            DATE NOT NULL,
    pomIdCategory      INT NOT NULL,
    pomIdSubcategory   INT NULL,

    CONSTRAINT pk_pomo              PRIMARY KEY (pomId),
    CONSTRAINT fk_pomo_category  FOREIGN KEY (pomIdCategory)
        REFERENCES category (catId),
    CONSTRAINT fk_pomo_subcategory  FOREIGN KEY (pomIdSubcategory)
        REFERENCES subcategory (subcId)
);
CREATE INDEX fk_pomo_category_index
    ON pomo(pomIdCategory);
CREATE INDEX fk_pomo_subcategory_index
    ON pomo(pomIdSubcategory);