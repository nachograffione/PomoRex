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
    VALUES (DEFAULT, '2022-03-01 10:00:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Clases ingeniería'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-01 10:30:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Clases ingeniería'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-01 11:15:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Clases ingeniería'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-01 10:30:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Otros'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-02 16:00:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Estudio facultad'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-02 17:00:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Estudio facultad'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-02 16:45:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Otros'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-02 16:50:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Otros'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-02 16:50:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Otros'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-02 16:51:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Otros'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-02 17:15:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Otros'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-02 23:59:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Otros'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-03 23:59:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Trabajo programación'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-04 08:40:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Trabajo programación'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-04 08:45:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Trabajo programación'));