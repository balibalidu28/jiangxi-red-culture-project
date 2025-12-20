INSERT INTO red_scenic_spot (name, location, description, image_url)
SELECT '井冈山', '江西省', '这是一个革命圣地', NULL
    WHERE NOT EXISTS (
    SELECT 1 FROM red_scenic_spot
    WHERE name = '井冈山' AND location = '江西省'
);