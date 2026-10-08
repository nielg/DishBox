/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql(`
    DO $$
    DECLARE
      u_ids INT[];
      baseUrl TEXT := 'http://localhost:4321/myRecipes/images/public/';
      available_images TEXT[] := ARRAY[
        'default-img.png',
        'images1.jpg',
        'images2.jpg',
        'images3.webp',
        'images4.jpg',
        'images5.jpg'
      ];
      rec RECORD;
      img_name TEXT;
      i INT := 0;
    BEGIN
      -- Insert two seed users to ensure recipes can be assigned
      INSERT INTO public."user" (user_name, first_name, last_name, email, password)
      VALUES 
        ('chef_alice', 'Alice', 'Baker', 'alice@dishbox.com', '$2a$10$dummyhashedpassword12345'),
        ('chef_bob', 'Bob', 'Cook', 'bob@dishbox.com', '$2a$10$dummyhashedpassword67890')
      ON CONFLICT DO NOTHING;

      -- Fetch existing user IDs into an array
      SELECT ARRAY_AGG(id) INTO u_ids FROM public."user";

      -- Ensure there is at least one user to assign recipes to
      IF u_ids IS NULL OR ARRAY_LENGTH(u_ids, 1) = 0 THEN
        RAISE EXCEPTION 'No users found in public."user". Please create at least one user before running this seed migration.';
      END IF;

      -- Insert 20 recipes
      INSERT INTO public.recipes (title, description, portions, ingredients, instructions, user_id, public) VALUES
      (
        'Classic Tomato Basil Pasta',
        'A simple and comforting Italian staple with fresh tomatoes and aromatic basil.',
        4,
        '["400g Spaghetti", "500g Cherry Tomatoes", "3 cloves Garlic", "1 bunch Fresh Basil", "3 tbsp Olive Oil"]'::jsonb,
        '["Boil pasta in salted water.", "Saute garlic and cherry tomatoes in olive oil until soft.", "Toss cooked pasta with sauce.", "Garnish with fresh basil before serving."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'Creamy Garlic Butter Salmon',
        'Pan-seared salmon fillets in a rich garlic butter cream sauce.',
        2,
        '["2 Salmon Fillets", "3 tbsp Butter", "4 cloves Garlic", "1/2 cup Heavy Cream", "2 cups Spinach"]'::jsonb,
        '["Sear salmon fillets in a skillet until golden, then set aside.", "Melt butter and sauté minced garlic.", "Add heavy cream and spinach, simmer until thickened.", "Return salmon to skillet and coat with sauce."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'Chickpea Coconut Curry',
        'A fragrant, mildly spiced coconut curry packed with protein and vegetables.',
        4,
        '["2 cans Chickpeas", "1 can Coconut Milk", "2 tbsp Curry Powder", "1 can Diced Tomatoes", "100g Spinach"]'::jsonb,
        '["Sauté onions and garlic in a pot until translucent.", "Stir in curry powder and toast for 1 minute.", "Add chickpeas, tomatoes, and coconut milk.", "Simmer for 20 minutes, then stir in spinach until wilted."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'Classic Beef Tacos',
        'Seasoned ground beef served in crisp tortilla shells with custom toppings.',
        4,
        '["500g Ground Beef", "1 packet Taco Seasoning", "8 Taco Shells", "1 cup Shredded Lettuce", "1 cup Cheddar Cheese"]'::jsonb,
        '["Brown the ground beef in a skillet and drain fat.", "Add taco seasoning and water according to packet instructions.", "Warm taco shells in the oven.", "Assemble tacos with beef, lettuce, cheese, and salsa."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'Avocado Toast with Poached Egg',
        'Nutritious breakfast topped with creamy avocado and runny poached eggs.',
        2,
        '["2 slices Sourdough Bread", "1 Ripe Avocado", "2 Eggs", "1 pinch Red Pepper Flakes", "1 tsp Lemon Juice"]'::jsonb,
        '["Toast sourdough slices.", "Mash avocado with lemon juice, salt, and pepper.", "Poach eggs in simmering water with vinegar for 3 minutes.", "Spread avocado on toast and top with poached egg."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'Vegan Lentil Soup',
        'Hearty, wholesome soup packed with brown lentils, carrots, and celery.',
        6,
        '["1 cup Brown Lentils", "2 diced Carrots", "2 diced Celery Stalks", "4 cups Vegetable Broth", "1 tsp Cumin"]'::jsonb,
        '["Sauté carrots, celery, and onions in olive oil.", "Add lentils, cumin, and vegetable broth.", "Bring to a boil, reduce heat, and simmer for 30 minutes.", "Season with salt and pepper to taste."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'Grilled Chicken Caesar Salad',
        'Crispy romaine tossed with grilled chicken, croutons, and Caesar dressing.',
        2,
        '["2 Chicken Breasts", "1 head Romaine Lettuce", "1/2 cup Parmesan Cheese", "1 cup Croutons", "4 tbsp Caesar Dressing"]'::jsonb,
        '["Season and grill chicken breasts until fully cooked, then slice.", "Chop romaine lettuce and place in a large bowl.", "Toss lettuce with Caesar dressing, croutons, and parmesan.", "Top with sliced grilled chicken."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        false
      ),
      (
        'Mushroom Risotto',
        'Rich, creamy Italian rice dish with sautéed wild mushrooms.',
        4,
        '["1.5 cups Arborio Rice", "300g Wild Mushrooms", "4 cups Vegetable Broth", "1/2 cup White Wine", "1/2 cup Parmesan Cheese"]'::jsonb,
        '["Sauté mushrooms in olive oil and set aside.", "Toast Arborio rice in a pan, deglaze with white wine.", "Gradually add warm broth stir constantly until absorbed.", "Stir in mushrooms and parmesan before serving."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'Tofu Veggie Stir-Fry',
        'Crispy tofu and colorful vegetables tossed in a savory soy-ginger sauce.',
        3,
        '["400g Firm Tofu", "1 head Broccoli", "1 Bell Pepper", "3 tbsp Soy Sauce", "1 tbsp Sesame Oil"]'::jsonb,
        '["Press and cube tofu, then pan-fry until golden and crisp.", "Stir-fry broccoli and sliced bell peppers.", "Combine tofu and veggies with soy sauce and ginger.", "Serve hot over steamed rice."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'Greek Lemon Roasted Potatoes',
        'Crispy baked potato wedges infused with lemon, garlic, and oregano.',
        4,
        '["1kg Yukon Gold Potatoes", "1/2 cup Lemon Juice", "1/3 cup Olive Oil", "4 cloves Garlic", "1 tbsp Dried Oregano"]'::jsonb,
        '["Cut potatoes into wedges and place in a baking dish.", "Whisk together lemon juice, olive oil, garlic, and oregano.", "Pour mixture over potatoes and bake at 200°C for 45 minutes until golden."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'Honey Garlic Glazed Pork Chops',
        'Tender bone-in pork chops with a sweet and savory pan glaze.',
        2,
        '["2 Pork Chops", "3 tbsp Honey", "2 tbsp Soy Sauce", "3 cloves Garlic", "1 tbsp Butter"]'::jsonb,
        '["Sear pork chops in a pan until browned on both sides.", "Combine honey, soy sauce, and minced garlic.", "Pour glaze over pork chops and simmer until sauce thickens."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        false
      ),
      (
        'Caprese Salad Skewers',
        'Bite-sized appetizers with cherry tomatoes, fresh mozzarella, and basil.',
        6,
        '["20 Cherry Tomatoes", "20 Mini Mozzarella Balls", "20 Fresh Basil Leaves", "2 tbsp Balsamic Glaze"]'::jsonb,
        '["Thread tomato, basil leaf, and mozzarella ball onto wooden skewers.", "Arrange on a serving platter.", "Drizzle with balsamic glaze right before serving."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'Crispy Baked Sweet Potato Fries',
        'Lightly seasoned, oven-baked sweet potato wedges with a crunch.',
        3,
        '["2 large Sweet Potatoes", "1 tbsp Cornstarch", "2 tbsp Olive Oil", "1 tsp Paprika"]'::jsonb,
        '["Slice sweet potatoes into uniform sticks.", "Toss with cornstarch, olive oil, and paprika.", "Spread on a baking sheet in a single layer.", "Bake at 220°C for 25-30 minutes, flipping halfway."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'Shrimp Scampi Pasta',
        'Succulent shrimp tossed with linguine in a white wine lemon garlic sauce.',
        2,
        '["300g Shrimp", "250g Linguine", "1/3 cup White Wine", "2 tbsp Lemon Juice", "2 tbsp Parsley"]'::jsonb,
        '["Boil linguine until al dente.", "Sauté garlic and shrimp in butter until pink.", "Deglaze with white wine and lemon juice.", "Combine pasta with shrimp sauce and top with parsley."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'Spicy Peanut Noodles',
        'Quick cold noodles tossed in a rich, creamy peanut and chili paste sauce.',
        2,
        '["2 packs Ramen Noodles", "3 tbsp Peanut Butter", "2 tbsp Soy Sauce", "1 tbsp Chili Oil", "1/2 julienned Cucumber"]'::jsonb,
        '["Cook noodles according to package, drain and rinse under cold water.", "Whisk peanut butter, soy sauce, chili oil, and warm water together.", "Toss noodles with sauce and top with cucumber slices."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'Classic Beef Chili',
        'Hearty, slow-simmered beef chili with kidney beans and rich spices.',
        6,
        '["700g Ground Beef", "2 cans Kidney Beans", "1 can Crushed Tomatoes", "2 tbsp Chili Powder", "1 diced Onion"]'::jsonb,
        '["Brown ground beef and onions in a pot.", "Add crushed tomatoes, drained kidney beans, and chili powder.", "Cover and simmer on low heat for 45 minutes.", "Serve hot topped with sour cream or cheese."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'Overnight Chia Seed Pudding',
        'An easy make-ahead breakfast pudding with chia seeds and almond milk.',
        2,
        '["1/2 cup Chia Seeds", "2 cups Almond Milk", "2 tbsp Maple Syrup", "1/2 cup Fresh Berries"]'::jsonb,
        '["Whisk chia seeds, almond milk, and maple syrup in a bowl.", "Cover and refrigerate overnight (at least 6 hours).", "Stir well before serving and top with fresh berries."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'BBQ Pulled Chicken Sandwiches',
        'Tender shredded chicken coated in tangy barbecue sauce on brioche buns.',
        4,
        '["500g Chicken Breasts", "1 cup BBQ Sauce", "4 Brioche Buns", "1 cup Coleslaw"]'::jsonb,
        '["Poach chicken breasts until fully cooked, then shred with two forks.", "Mix shredded chicken with barbecue sauce in a pan over low heat.", "Serve pulled chicken on toasted brioche buns with coleslaw."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        false
      ),
      (
        'Roasted Cauliflower Steak',
        'Thick cauliflower slabs seasoned with garlic, turmeric, and roasted to perfection.',
        2,
        '["1 head Cauliflower", "3 tbsp Olive Oil", "1 tsp Garlic Powder", "1/2 tsp Turmeric"]'::jsonb,
        '["Slice cauliflower head into 1-inch thick steaks.", "Brush both sides with olive oil and spices.", "Roast at 200°C for 30 minutes, flipping halfway until caramelized."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      ),
      (
        'French Onion Soup',
        'Rich beef broth soup with caramelized onions and melted Gruyère toast.',
        4,
        '["4 sliced Yellow Onions", "4 cups Beef Broth", "1 cup Gruyere Cheese", "4 slices Baguette", "2 tbsp Butter"]'::jsonb,
        '["Caramelize onions slowly in butter over medium-low heat for 40 minutes.", "Add beef broth and simmer for 20 minutes.", "Ladle soup into oven-safe bowls, top with baguette and Gruyere.", "Broil until cheese is bubbly and browned."]'::jsonb,
        u_ids[1 + floor(random() * array_length(u_ids, 1))],
        true
      );

      -- Attach images to the newly created seed recipes
      FOR rec IN 
        SELECT id FROM public.recipes 
        WHERE title IN (
          'Classic Tomato Basil Pasta', 'Creamy Garlic Butter Salmon', 'Chickpea Coconut Curry',
          'Classic Beef Tacos', 'Avocado Toast with Poached Egg', 'Vegan Lentil Soup',
          'Grilled Chicken Caesar Salad', 'Mushroom Risotto', 'Tofu Veggie Stir-Fry',
          'Greek Lemon Roasted Potatoes', 'Honey Garlic Glazed Pork Chops', 'Caprese Salad Skewers',
          'Crispy Baked Sweet Potato Fries', 'Shrimp Scampi Pasta', 'Spicy Peanut Noodles',
          'Classic Beef Chili', 'Overnight Chia Seed Pudding', 'BBQ Pulled Chicken Sandwiches',
          'Roasted Cauliflower Steak', 'French Onion Soup'
        )
        ORDER BY id
      LOOP
        img_name := available_images[(i % array_length(available_images, 1)) + 1];

        INSERT INTO public.recipe_images (recipe_id, image_url, img_storage_type)
        VALUES (rec.id, baseUrl || img_name, 'local');

        i := i + 1;
      END LOOP;

    END $$;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    -- Delete images belonging to seeded recipes
    DELETE FROM public.recipe_images
    WHERE recipe_id IN (
      SELECT id FROM public.recipes WHERE title IN (
        'Classic Tomato Basil Pasta',
        'Creamy Garlic Butter Salmon',
        'Chickpea Coconut Curry',
        'Classic Beef Tacos',
        'Avocado Toast with Poached Egg',
        'Vegan Lentil Soup',
        'Grilled Chicken Caesar Salad',
        'Mushroom Risotto',
        'Tofu Veggie Stir-Fry',
        'Greek Lemon Roasted Potatoes',
        'Honey Garlic Glazed Pork Chops',
        'Caprese Salad Skewers',
        'Crispy Baked Sweet Potato Fries',
        'Shrimp Scampi Pasta',
        'Spicy Peanut Noodles',
        'Classic Beef Chili',
        'Overnight Chia Seed Pudding',
        'BBQ Pulled Chicken Sandwiches',
        'Roasted Cauliflower Steak',
        'French Onion Soup'
      )
    );

    -- Delete seeded recipes
    DELETE FROM public.recipes 
    WHERE title IN (
      'Classic Tomato Basil Pasta',
      'Creamy Garlic Butter Salmon',
      'Chickpea Coconut Curry',
      'Classic Beef Tacos',
      'Avocado Toast with Poached Egg',
      'Vegan Lentil Soup',
      'Grilled Chicken Caesar Salad',
      'Mushroom Risotto',
      'Tofu Veggie Stir-Fry',
      'Greek Lemon Roasted Potatoes',
      'Honey Garlic Glazed Pork Chops',
      'Caprese Salad Skewers',
      'Crispy Baked Sweet Potato Fries',
      'Shrimp Scampi Pasta',
      'Spicy Peanut Noodles',
      'Classic Beef Chili',
      'Overnight Chia Seed Pudding',
      'BBQ Pulled Chicken Sandwiches',
      'Roasted Cauliflower Steak',
      'French Onion Soup'
    );

    -- Delete the seeded users
    DELETE FROM public."user"
    WHERE email IN ('alice@dishbox.com', 'bob@dishbox.com');
  `);
};
