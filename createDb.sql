-- CREATE DATABASE pomoRex;


CREATE TABLE category (
    catId      SERIAL,     -- == INT NOT NULL
	catName    CHAR(40) NOT NULL,

    CONSTRAINT pk_category      PRIMARY KEY (catId),
    CONSTRAINT ak_category      UNIQUE (catName)
);


CREATE TABLE subcategory (
    subcId          SERIAL,     -- == INT NOT NULL
	subcName        CHAR(40) NOT NULL,
    subcIdCategory  INT NOT NULL,

    CONSTRAINT pk_subcategory              PRIMARY KEY (subcId),
    CONSTRAINT ak_subcategory              UNIQUE (subcName, subcIdCategory),
    CONSTRAINT fk_subsubcategory_category  FOREIGN KEY (subcIdCategory)
        REFERENCES category (catId)
);
CREATE INDEX index_fk_subcategory_category
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
CREATE INDEX index_fk_pomo_category
    ON pomo(pomIdCategory);
CREATE INDEX index_fk_pomo_subcategory
    ON pomo(pomIdSubcategory);