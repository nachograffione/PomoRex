-----------------------------------------------------------------
-- Tests to fail

-- Cases:
--     1) Pomos that tries to break the constraints implemented with table constraints
--            (They are easy things, omit them for now)
--     2) Pomos that tries to break the constraints implemented with triggers
--             2.1) The pomo's category is referred by one or more subcategories
--					 if and only if the subcategory is not null
--                 2.1.1) The antecedent is true but the consequent is false
--                 2.1.2) The antecedent is false but the consequent is true
--             2.2) If the pomo's subcategory is not null,
--                     then it belongs to the category
--                 2.2.1) The antecedent is true but the consequent is false
--                 (The other cases that will pass but are no necessary valid are managed by the 2.1 constraint)

-- Case 2.1.1
INSERT INTO pomo
	VALUES (DEFAULT, '2022/03/01',
			(SELECT catId FROM category
				WHERE catName = 'Facultad'));
-- Case 2.1.2
INSERT INTO pomo
	VALUES (DEFAULT,
			'2022/03/01',
			(SELECT catId FROM category
				WHERE catName = 'Otros'),
			1	-- If you run a SELECT to get some subcId using some string, since it doesn't exist,
				-- the result will be null and it won't fail.
				-- It's 1 so it will exist and the FK table constraint is followed
			);
    
-- Case 2.2.1
INSERT INTO pomo
	VALUES (DEFAULT, '2022/03/01',
			(SELECT catId FROM category
				WHERE catName = 'Música'),
		   	(SELECT subcId FROM subcategory
				WHERE subcName = 'Trabajo')
		   );