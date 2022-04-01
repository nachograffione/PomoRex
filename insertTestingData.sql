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
        (SELECT catId FROM category WHERE catName = 'Facultad'));
INSERT INTO subcategory
    VALUES (DEFAULT, 'TPs, Otros',
        (SELECT catId FROM category WHERE catName = 'Facultad'));

-- Case 2
INSERT INTO category
    VALUES (DEFAULT, 'Música');
INSERT INTO subcategory
    VALUES (DEFAULT, 'Clases',
        (SELECT catId FROM category WHERE catName = 'Música'));
INSERT INTO subcategory
    VALUES (DEFAULT, 'Ejercitar, tocar, componer, etc.',
        (SELECT catId FROM category WHERE catName = 'Música'));

INSERT INTO category
    VALUES (DEFAULT, 'Ingeniería');
INSERT INTO subcategory
    VALUES (DEFAULT, 'Clases',
        (SELECT catId FROM category WHERE catName = 'Ingeniería'));
INSERT INTO subcategory
    VALUES (DEFAULT, 'Trabajo',
        (SELECT catId FROM category WHERE catName = 'Ingeniería'));

-- Case 3
INSERT INTO category
    VALUES (DEFAULT, 'Otros');

-----------------------------------------------------------------
-- Pomos

-- Cases:
--     1) A pomo with category and subcategory
--     2) A pomo with only category

-- Case 1
INSERT INTO pomo
    VALUES (DEFAULT, '2022/03/01',
            (SELECT catId FROM category
                WHERE catName = 'Ingeniería'),
            (SELECT subcId FROM subcategory
                WHERE subcIdCategory = (SELECT catId FROM category
                                        WHERE catName = 'Ingeniería') AND
                subcName = 'Clases'));

-- Case 2
INSERT INTO pomo
    VALUES (DEFAULT, '2022/03/01',
        (SELECT catId FROM category WHERE catName = 'Otros'));
