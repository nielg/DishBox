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
    CREATE TABLE tags (
      id BIGSERIAL PRIMARY KEY,
      value VARCHAR(255) NOT NULL UNIQUE
    );

    INSERT INTO tags (value) VALUES 
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

    CREATE TABLE recipe_tags (
      recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
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
    DROP TABLE IF EXISTS recipe_tags;
    DROP TABLE IF EXISTS tags;
  `;
};
