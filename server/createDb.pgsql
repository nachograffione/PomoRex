-- CREATE DATABASE pomo_rex;


CREATE TABLE category (
    id      SERIAL,     -- == INT NOT NULL
	name    VARCHAR(40) NOT NULL,

    CONSTRAINT pk_category      PRIMARY KEY (id),
    CONSTRAINT ak_category      UNIQUE (name)
);

-- I have to name like this because i cant't use group, set, class or type
CREATE TABLE group_of_cats (
    id          SERIAL,     -- == INT NOT NULL
	name        VARCHAR(40) NOT NULL,

    CONSTRAINT pk_group_of_cats                    PRIMARY KEY (id),
    CONSTRAINT ak_group_of_cats                    UNIQUE (name)
);

CREATE TABLE cat_gr (
    cat_id     INT NOT NULL,
    gr_id      INT NOT NULL,

    CONSTRAINT fk_cat_gr_category  FOREIGN KEY (cat_id)
        REFERENCES category (id),
    CONSTRAINT fk_cat_gr_group_of_cats  FOREIGN KEY (gr_id)
        REFERENCES group_of_cats (id)
);
CREATE INDEX index_fk_cat_gr_category
    ON cat_gr (cat_id);
CREATE INDEX index_fk_cat_gr_group_of_cats
    ON cat_gr (gr_id);


CREATE TABLE pomo (
    id              SERIAL,     -- == INT NOT NULL
	datetime        TIMESTAMPTZ NOT NULL,
    cat_id           INT NOT NULL,

    CONSTRAINT pk_pomo              PRIMARY KEY (id),
    CONSTRAINT fk_pomo_category  FOREIGN KEY (cat_id)
        REFERENCES category (id)
);
CREATE INDEX index_fk_pomo_category
    ON pomo(cat_id);