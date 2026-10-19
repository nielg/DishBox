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
    ALTER TABLE dishbox.recipes 
    ADD COLUMN likes_count INTEGER NOT NULL DEFAULT 0;

    CREATE OR REPLACE FUNCTION update_recipe_likes_count()
    RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP = 'INSERT') THEN
            UPDATE dishbox.recipes 
            SET likes_count = likes_count + 1 
            WHERE id = NEW.recipe_id;
        ELSIF (TG_OP = 'DELETE') THEN
            UPDATE dishbox.recipes 
            SET likes_count = likes_count - 1 
            WHERE id = OLD.recipe_id;
        END IF;
    RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trigger_update_recipe_likes_count
    AFTER INSERT OR DELETE ON dishbox.user_recipes_favorite
    FOR EACH ROW
    EXECUTE FUNCTION update_recipe_likes_count();
    `;
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    DROP TRIGGER IF EXISTS trigger_update_recipe_likes_count ON dishBox.user_recipes_favorite;

    DROP FUNCTION IF EXISTS update_recipe_likes_count();

    ALTER TABLE dishBox.recipes 
    DROP COLUMN IF EXISTS likes_count;
  `);
};
