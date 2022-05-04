-- CREATE DATABASE pomoRex;


CREATE TABLE category (
    catId      SERIAL,     -- == INT NOT NULL
	catName    VARCHAR(40) NOT NULL,

    CONSTRAINT pk_category      PRIMARY KEY (catId),
    CONSTRAINT ak_category      UNIQUE (catName)
);


CREATE TABLE set (
    setId          SERIAL,     -- == INT NOT NULL
	setName        VARCHAR(40) NOT NULL,

    CONSTRAINT pk_set                    PRIMARY KEY (setId),
    CONSTRAINT ak_set                    UNIQUE (setName)
);

CREATE TABLE catSet (
    catId     INT NOT NULL,
    setId   INT NOT NULL,

    CONSTRAINT fk_catSet_category  FOREIGN KEY (catId)
        REFERENCES category (catId),
    CONSTRAINT fk_catSet_set  FOREIGN KEY (setId)
        REFERENCES set (setId)
);
CREATE INDEX index_fk_catSet_category
    ON catSet (catId);
CREATE INDEX index_fk_catSet_set
    ON catSet (setId);


CREATE TABLE pomo (
    pomId              SERIAL,     -- == INT NOT NULL
	pomDatetime        TIMESTAMP NOT NULL,
    pomIdCategory      INT NOT NULL,

    CONSTRAINT pk_pomo              PRIMARY KEY (pomId),
    CONSTRAINT fk_pomo_category  FOREIGN KEY (pomIdCategory)
        REFERENCES category (catId)
);
CREATE INDEX index_fk_pomo_category
    ON pomo(pomIdCategory);