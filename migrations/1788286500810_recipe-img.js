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
        CREATE TABLE public.recipe_images (
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            recipe_id INTEGER NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
            image_url TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        CREATE TRIGGER update_recipe_images_updated_at
            BEFORE UPDATE ON public.recipe_images
            FOR EACH ROW
            EXECUTE FUNCTION set_updated_at();
        `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
        DROP TABLE IF EXISTS public.recipe_images;
    `);
};
