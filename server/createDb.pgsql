-- CREATE DATABASE pomoRex;


CREATE TABLE category (
    id      SERIAL,     -- == INT NOT NULL
	name    VARCHAR(40) NOT NULL,

    CONSTRAINT pk_category      PRIMARY KEY (id),
    CONSTRAINT ak_category      UNIQUE (name)
);

-- I have to name like this because i cant't use group, set, class or type
CREATE TABLE groupOfCats (
    id          SERIAL,     -- == INT NOT NULL
	name        VARCHAR(40) NOT NULL,

    CONSTRAINT pk_groupOfCats                    PRIMARY KEY (id),
    CONSTRAINT ak_groupOfCats                    UNIQUE (name)
);

CREATE TABLE catGr (
    catId     INT NOT NULL,
    grId      INT NOT NULL,

    CONSTRAINT fk_catGr_category  FOREIGN KEY (catId)
        REFERENCES category (id),
    CONSTRAINT fk_catGr_groupOfCats  FOREIGN KEY (grId)
        REFERENCES groupOfCats (id)
);
CREATE INDEX index_fk_catGr_category
    ON catGr (catId);
CREATE INDEX index_fk_catGr_groupOfCats
    ON catGr (grId);


CREATE TABLE pomo (
    id              SERIAL,     -- == INT NOT NULL
	datetime        TIMESTAMP NOT NULL,
    catId           INT NOT NULL,

    CONSTRAINT pk_pomo              PRIMARY KEY (id),
    CONSTRAINT fk_pomo_category  FOREIGN KEY (catId)
        REFERENCES category (id)
);
CREATE INDEX index_fk_pomo_category
    ON pomo(catId);