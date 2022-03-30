-----------------------------------------------------------------
-- Categories and Subcategories

-- Cases:
--     1) A category with different subcategories from the others
--     2) Two categories with some same subcategories than others
--     3) A category without subcategories

-- Case 1
INSERT INTO category
    VALUES (DEFAULT, 'Facultad');
INSERT INTO subcategory
    VALUES (DEFAULT, 'Estudio',
        (SELECT catID FROM category WHERE catName = 'Facultad'));
INSERT INTO subcategory
    VALUES (DEFAULT, 'TPs, Otros',
        (SELECT catID FROM category WHERE catName = 'Facultad'));

-- Case 2
INSERT INTO category
    VALUES (DEFAULT, 'Música');
INSERT INTO subcategory
    VALUES (DEFAULT, 'Clases',
        (SELECT catID FROM category WHERE catName = 'Música'));
INSERT INTO subcategory
    VALUES (DEFAULT, 'Ejercitar, tocar, componer, etc.',
        (SELECT catID FROM category WHERE catName = 'Música'));

INSERT INTO category
    VALUES (DEFAULT, 'Ingeniería');
INSERT INTO subcategory
    VALUES (DEFAULT, 'Clases',
        (SELECT catID FROM category WHERE catName = 'Ingeniería'));
INSERT INTO subcategory
    VALUES (DEFAULT, 'Trabajo',
        (SELECT catID FROM category WHERE catName = 'Ingeniería'));

-- Case 3
INSERT INTO category
    VALUES (DEFAULT, 'Otros');
