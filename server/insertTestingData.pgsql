-- Categories and groups
-- Criteria:
--      grouped cats, ungrouped cats

-- Data:
-- Categories:                             Groups:
-- Estudio facultad                        Facultad
-- TPs, Otros de facultad                  Facultad
-- Clases música                           Música
-- Ejercitar, tocar, componer, etc.        Música
-- Clases ingeniería                       Ingeniería
-- Trabajo programación                    Ingeniería
-- Otros                                   -

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
-- Criteria:
--      days with repeated pomos, unrepeated pomos, combinations of them, different hours (including time endpoints), different cats and groups

-- Data:
-- 2022-03-04
--     4 Trabajo programación
--     3 Estudio facultad
-- 2022-03-03
--     0
-- 2022-03-02
--     1 Ejercitar, tocar, componer, etc.
--     1 Otros
-- 2022-03-01
--     2 Estudio facultad
--     1 Clases música


INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-01 00:00:00.000 -03:00', -- first time endpoint
            (SELECT id FROM category
                WHERE name = 'Estudio facultad'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-01 10:30:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Estudio facultad'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-01 11:15:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Clases música'));

INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-02 16:00:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Ejercitar, tocar, componer, etc.'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-02 12:00:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Otros'));

INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-04 17:00:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Trabajo programación'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-04 16:45:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Trabajo programación'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-04 16:50:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Trabajo programación'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-04 16:50:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Trabajo programación'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-04 16:51:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Estudio facultad'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-04 17:15:00.000 -03:00',
            (SELECT id FROM category
                WHERE name = 'Estudio facultad'));
INSERT INTO pomo
    VALUES (DEFAULT, '2022-03-04 23:59:59.999 -03:00',  -- last time endpoint
            (SELECT id FROM category
                WHERE name = 'Estudio facultad'));