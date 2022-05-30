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

CREATE TABLE category_group_of_cats (
    cat_id     INT NOT NULL,
    gr_id      INT NOT NULL,

    CONSTRAINT pk_category_group_of_cats      PRIMARY KEY (cat_id, gr_id),
    CONSTRAINT fk_category_group_of_cats_category  FOREIGN KEY (cat_id)
        REFERENCES category (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_category_group_of_cats_group_of_cats  FOREIGN KEY (gr_id)
        REFERENCES group_of_cats (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX index_fk_category_group_of_cats_category
    ON category_group_of_cats (cat_id);
CREATE INDEX index_fk_category_group_of_cats_group_of_cats
    ON category_group_of_cats (gr_id);


CREATE TABLE pomo (
    id              SERIAL,     -- == INT NOT NULL
	datetime        TIMESTAMPTZ NOT NULL,
    cat_id           INT NOT NULL,

    CONSTRAINT pk_pomo              PRIMARY KEY (id),
    CONSTRAINT fk_pomo_category  FOREIGN KEY (cat_id)
        REFERENCES category (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX index_fk_pomo_category
    ON pomo(cat_id);