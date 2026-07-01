/*
# Seed categories and products from existing static data

1. Changes
- Insert 5 categories with subcategories matching the existing constants
- Insert 20 products from the existing static product catalog
- All data is mapped from src/constants/categories.ts and src/constants/products.ts
2. Security
- Data is inserted as a privileged role (migration bypasses RLS)
3. Notes
- Uses ON CONFLICT to be idempotent on re-run
- Prices and ratings preserved from original data
*/

-- Insert categories
INSERT INTO categories (name, slug, subcategories, sort_order) VALUES
('Grocery', 'grocery', '["Breakfast","Cooking ingredients","Dairy","Food & Beverages","Snacks & Confectioneries"]'::jsonb, 1),
('Non-Grocery', 'non-grocery', '["Household & Cleaning Products","Kitchenware & Cookware","Personal Care & Beauty Products","Car Care & Accessories"]'::jsonb, 2),
('Perfume', 'perfume', '["Premium Perfumes","Men Perfumes","Women Perfumes","Deodorants & Body Sprays","Deodorant Sticks & Roll-Ons","Mists & Essences","Gift Sets","After Shave"]'::jsonb, 3),
('Skin Care', 'skin-care', '["Makeup Removers","Gels & Oils","Moisturizer","Serums","Beauty Soaps","Body Wash","Scrubs","Creams & Lotions","Face Wash & Cleansers","Facial Mask","Liquid Soaps","Sunblocks & Sunscreen","Wipes","Toners","Strips","Sheet Masks","Facial Care","Skin Care - Treatments","Makeup Fixer","Hand Wash & Sanitizer","Waxes"]'::jsonb, 4),
('Baby', 'baby', '["New Born Accessories","Baby Food","Baby Feeding Accessories","Baby Care Products","Maternity Care Products","Baby Toiletry","Diapers & Wipes","Baby Essentials & Toys"]'::jsonb, 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert products (linked by category_id via subquery)
INSERT INTO products (name, slug, price, category_id, subcategory, image, rating, in_stock, featured) VALUES
('AL SHIFA HONEY NATURAL PLASTIC BOTTLE 250 GM', 'al-shifa-honey-natural-bottle-250-gm', 1475, (SELECT id FROM categories WHERE slug = 'grocery'), 'Breakfast', 'https://alfatah.pk/cdn/shop/files/6281073211065.jpg?v=1690207890&width=500', 4.8, true, true),
('SUNBEAM BARLEY PORRIDGE CRUSHED POUCH 1 KG', 'sunbeam-barley-porridge-crushed-pouch-1-kg', 745, (SELECT id FROM categories WHERE slug = 'grocery'), 'Breakfast', 'https://alfatah.pk/cdn/shop/files/8698785196562_2.jpg?v=1709203659&width=500', 4.5, true, true),
('SHEZAN DIET MIX FRUIT JAM 320 GM', 'shezan-diet-mix-fruit-jam-320-gm', 275, (SELECT id FROM categories WHERE slug = 'grocery'), 'Snacks & Confectioneries', 'https://alfatah.pk/cdn/shop/files/8964000052310_6f3497fb-d876-459f-ac33-625f2bb02af2.jpg?v=1727690722&width=500', 4.2, true, false),
('MITCHELLS JAM FRUIT MIXED TIN 1050 GM', 'mitchells-jam-fruit-mixed-tin-1050-gm', 615, (SELECT id FROM categories WHERE slug = 'grocery'), 'Snacks & Confectioneries', 'https://alfatah.pk/cdn/shop/files/NewProject_10_48b13089-85d8-456c-a7c1-cab112c3434b.png?v=1763113367&width=500', 4.6, true, true),
('CHERRY BLOSSOM READY WAX BLACK 85 ML', 'cherry-blossom-ready-wax-black-85-ml', 595, (SELECT id FROM categories WHERE slug = 'non-grocery'), 'Household & Cleaning Products', 'https://alfatah.pk/cdn/shop/files/NewProject-2025-11-18T181544.063.png?v=1763471817&width=500', 4.7, true, true),
('YUPPIES HI BLACK 75ML', 'yuppies-hi-black-75ml', 495, (SELECT id FROM categories WHERE slug = 'non-grocery'), 'Household & Cleaning Products', 'https://alfatah.pk/cdn/shop/files/9557458543692_95777a3b-b5d2-437c-ac03-9da2171d1eb2.jpg?v=1750421716&width=500', 4.4, true, false),
('WOODEN SHOE HORN IR A86-87', 'wooden-shoe-horn-ir-a86-87', 355, (SELECT id FROM categories WHERE slug = 'non-grocery'), 'Household & Cleaning Products', 'https://alfatah.pk/cdn/shop/files/2021040001510_1_9b66080c-65f1-484a-9b13-50cbfd108f42.jpg?v=1711523230&width=500', 4.3, true, false),
('SHOE LACES SMALL BROWN', 'shoe-laces-small-brown', 65, (SELECT id FROM categories WHERE slug = 'non-grocery'), 'Household & Cleaning Products', 'https://alfatah.pk/cdn/shop/files/1304063589311_5ba8fd21-835a-4ed9-81d9-3ad1ef48c448.jpg?v=1726838900&width=500', 4.0, true, false),
('THOMAS KOSMALA APRE L AMOUR NO 4 MEN EDP 100 ML', 'thomas-kosmala-apre-l-amour-no-4-edp-100-ml', 25900, (SELECT id FROM categories WHERE slug = 'perfume'), 'Men Perfumes', 'https://alfatah.pk/cdn/shop/files/AFP-000265540_780fab6c-85bc-4eb5-be2e-9624b029dcb5.jpg?v=1754123546&width=500', 4.9, true, true),
('LATTAFA KHAMRAH FOR UNISEX PARFUM 100ML', 'lattafa-khamrah-for-unisex-parfum-100ml', 6400, (SELECT id FROM categories WHERE slug = 'perfume'), 'Men Perfumes', 'https://alfatah.pk/cdn/shop/files/2025080000373_43a7713f-3261-4b13-81ab-7a81289cc1a4.jpg?v=1756731214&width=500', 4.8, true, true),
('LATTAFA KHAMRAH QAHWA FOR UNISEX EDP 100ML', 'lattafa-khamrah-qahwa-for-unisex-edp-100ml', 6790, (SELECT id FROM categories WHERE slug = 'perfume'), 'Men Perfumes', 'https://alfatah.pk/cdn/shop/files/NewProject_4_8e61106d-5080-4810-b28c-69826e9a611e.png?v=1757073643&width=500', 4.9, true, true),
('LATTAFA EJAAZI FOR MEN EDP 100 ML', 'ejaazi-lattafa-for-men-edp-100-ml', 3990, (SELECT id FROM categories WHERE slug = 'perfume'), 'Men Perfumes', 'https://alfatah.pk/cdn/shop/files/AFP-000299000_b260555a-1090-410c-86dc-ab1c2b204e3d.jpg?v=1754123566&width=500', 4.7, true, true),
('BARULAB 7IN1 TOTAL SOLUTION BLUE AQUA MASK', 'barulab-7in1-total-solution-blue-aqua-mask', 1980, (SELECT id FROM categories WHERE slug = 'skin-care'), 'Facial Mask', 'https://alfatah.pk/cdn/shop/files/AFP-000378318_9adcb006-0c96-4db5-9a44-d1d0d7bccd29.jpg?v=1754651019&width=500', 4.6, true, true),
('CAILYN-BARULAB AHA/BHA EXFOLIATING MASK', 'cailyn-barulab-aha-bha-exfoliating-mask', 990, (SELECT id FROM categories WHERE slug = 'skin-care'), 'Facial Mask', 'https://alfatah.pk/cdn/shop/files/8809420800403_5df2efcb-6770-43d4-9e79-48847ead112d.jpg?v=1736342282&width=500', 4.5, true, false),
('BARULAB STEAM SHEET MOISTURE SHIELD OILLOCK FACIAL MASK', 'barulab-steam-sheet-moisture-shield-oillocktm-facial-mask', 2480, (SELECT id FROM categories WHERE slug = 'skin-care'), 'Facial Mask', 'https://alfatah.pk/cdn/shop/files/AFP-000478170_d70a3066-ced7-4b2e-b5b9-157b657c2909.jpg?v=1754651019&width=500', 4.7, true, true),
('CAILYN-BARULAB SHEABUTTER NOURISHING MASK', 'cailyn-barulab-sheabutter-nourishing-mask', 990, (SELECT id FROM categories WHERE slug = 'skin-care'), 'Facial Mask', 'https://alfatah.pk/cdn/shop/files/8809420800502_84d44033-658f-42d1-a70f-acd37cdf4fe5.jpg?v=1736342294&width=500', 4.4, true, false),
('NESTLE CERELAC RICE 175 GM', 'nestle-cerelac-rice-175-gm', 440, (SELECT id FROM categories WHERE slug = 'baby'), 'Baby Food', 'https://alfatah.pk/cdn/shop/files/NewProject_10_eaabcdf6-1cf4-426f-9940-710bc150d40e.png?v=1749716282&width=500', 4.8, true, true),
('MORINAGA BF GROW GROWING UP FORMULA VANILLA STAGE 3 900 GM', 'morinaga-bf-gro3-vanilla-box-900-gm', 3495, (SELECT id FROM categories WHERE slug = 'baby'), 'Baby Food', 'https://alfatah.pk/cdn/shop/files/NewProject_3_13fb025e-83e1-4093-8991-6bacb09b73c9.png?v=1743669050&width=500', 4.7, true, true),
('NESTLE NIDO MILK POWDER GROWING UP FORMULA 1PLUS 900 GM', 'nestle-nido-milk-powder-growing-up-formula-1plus-900-gm', 2615, (SELECT id FROM categories WHERE slug = 'baby'), 'Baby Food', 'https://alfatah.pk/cdn/shop/files/AFP-000357949_2.jpg?v=1766219611&width=500', 4.9, true, true),
('MEIJI BIG MILK POWDER VANILLA 3 900 GM', 'meiji-big-milk-powder-vanilla-3-900-gm', 5095, (SELECT id FROM categories WHERE slug = 'baby'), 'Baby Food', 'https://alfatah.pk/cdn/shop/files/NewProject_5_65d88388-c76e-41e4-976d-ae3d5d8669b1.png?v=1743661181&width=500', 4.6, true, true)
ON CONFLICT (slug) DO NOTHING;
