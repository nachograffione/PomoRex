-- Categories
INSERT INTO category
    VALUES (DEFAULT, 'Estudio facultad');
INSERT INTO category
    VALUES (DEFAULT, 'TPs, Otros de facultad');
INSERT INTO category
    VALUES (DEFAULT, 'Clases música');
INSERT INTO category
    VALUES (DEFAULT, 'Ejercitar, tocar, componer, etc.');
INSERT INTO category
    VALUES (DEFAULT, 'Clases ingeniería');
INSERT INTO category
    VALUES (DEFAULT, 'Trabajo programación');
INSERT INTO category
    VALUES (DEFAULT, 'Otros');

-- Groups
INSERT INTO group_of_cats
    VALUES (DEFAULT, 'Facultad');
INSERT INTO group_of_cats
    VALUES (DEFAULT, 'Música');
INSERT INTO group_of_cats
    VALUES (DEFAULT, 'Ingeniería');

-- Assignments
INSERT INTO cat_gr
    VALUES ((SELECT id FROM category WHERE name = 'Estudio facultad'),
            (SELECT id FROM group_of_cats
         WHERE name = 'Facultad'));
INSERT INTO cat_gr
    VALUES ((SELECT id FROM category WHERE name = 'TPs, Otros de facultad'),
            (SELECT id FROM group_of_cats
         WHERE name = 'Facultad'));
INSERT INTO cat_gr
    VALUES ((SELECT id FROM category WHERE name = 'Clases música'),
            (SELECT id FROM group_of_cats
         WHERE name = 'Música'));
INSERT INTO cat_gr
    VALUES ((SELECT id FROM category WHERE name = 'Ejercitar, tocar, componer, etc.'),
            (SELECT id FROM group_of_cats
         WHERE name = 'Música'));
INSERT INTO cat_gr
    VALUES ((SELECT id FROM category WHERE name = 'Clases ingeniería'),
            (SELECT id FROM group_of_cats
         WHERE name = 'Ingeniería'));
INSERT INTO cat_gr
    VALUES ((SELECT id FROM category WHERE name = 'Trabajo programación'),
            (SELECT id FROM group_of_cats
         WHERE name = 'Ingeniería'));

-- Pomos
INSERT INTO pomo
    VALUES (DEFAULT, '2022/03/01',
            (SELECT id FROM category
                WHERE name = 'Clases ingeniería'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022/03/01',
            (SELECT id FROM category
                WHERE name = 'Otros'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022/03/02',
            (SELECT id FROM category
                WHERE name = 'Estudio facultad'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022/03/02',
            (SELECT id FROM category
                WHERE name = 'Otros'));
