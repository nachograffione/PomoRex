﻿-- CREATE DATABASE pomoRex;


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


CREATE OR REPLACE FUNCTION chk_pomo
	()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	AS
	$$
	BEGIN
	-- These are implications translated to conjunctions by theorems and logic operations
		
		-- The pomo's category is referred by one or more subcategories
		-- if and only if the subcategory is not null
        IF (NEW.pomIdCategory IN (SELECT subcIdCategory FROM subcategory) AND
                NOT (NEW.pomIdSubcategory IS NOT NULL))
			OR
		   (NOT (NEW.pomIdCategory IN (SELECT subcIdCategory FROM subcategory)) AND
                 NEW.pomIdSubcategory IS NOT NULL) THEN
			RAISE NOTICE 'Insert/Update failed. Broken rule: The pomo''s category is referred by one or more subcategories if and only if the subcategory is not null.';
            RETURN NULL;
		-- If the pomo's subcategory is not null,
		-- then it belongs to the category
        ELSIF (NEW.pomIdSubcategory IS NOT NULL AND
                	NOT (NEW.pomIdCategory = (SELECT subcIdCategory
                                        		FROM subcategory
                                        		WHERE subcId = NEW.pomIdSubcategory))) THEN
            RAISE NOTICE 'Insert/Update failed. Broken rule: If the pomo''s subcategory is not null, then it belongs to the category.';
            RETURN NULL;
        ELSE
			RETURN NEW;
        END IF;
	END;
	$$;


CREATE TRIGGER trg_pomo_ins_upd
	BEFORE
		INSERT OR
        UPDATE OF pomIdCategory, pomIdSubcategory
    ON pomo
	FOR EACH ROW
		EXECUTE PROCEDURE chk_pomo();