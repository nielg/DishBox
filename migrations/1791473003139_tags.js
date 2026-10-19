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
  pgm.sql`
    CREATE TABLE dishBox.tags (
      id BIGSERIAL PRIMARY KEY,
      value VARCHAR(255) NOT NULL UNIQUE
    );

    INSERT INTO dishBox.tags (value) VALUES 
      ('vegan'),
      ('vegetarian'),
      ('gluten-free'),
      ('dairy-free'),
      ('quick'),
      ('easy'),
      ('fish'),
      ('meat'),
      ('bbq'),
      ('dessert'),
      ('breakfast');

    CREATE TABLE dishBox.recipe_tags (
      recipe_id BIGINT NOT NULL REFERENCES dishBox.recipes(id) ON DELETE CASCADE,
      tag_id BIGINT NOT NULL REFERENCES dishBox.tags(id) ON DELETE CASCADE,
      PRIMARY KEY (recipe_id, tag_id)
    );
  `;
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql`
    DROP TABLE IF EXISTS dishBox.recipe_tags;
    DROP TABLE IF EXISTS dishBox.tags;
  `;
};
