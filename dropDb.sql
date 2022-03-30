DROP TRIGGER trg_pomo_ins_upd ON pomo;
DROP FUNCTION chk_pomo(); 

DROP INDEX index_fk_subcategory_category;
DROP INDEX index_fk_pomo_category;
DROP INDEX index_fk_pomo_subcategory;

DROP TABLE pomo;
DROP TABLE subcategory;
DROP TABLE category;

-- DROP DATABASE pomoRex;