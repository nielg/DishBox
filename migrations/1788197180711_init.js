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
    -- Create reusable trigger function for auto-updating updated_at
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- User table
    CREATE TABLE public."user" (
      id SERIAL PRIMARY KEY,
      user_name VARCHAR(255) NOT NULL UNIQUE,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TRIGGER update_user_updated_at
      BEFORE UPDATE ON public."user"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();

    -- Recipes table
    CREATE TABLE public.recipes (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      portions INTEGER NOT NULL,
      ingredients JSONB NOT NULL,
      instructions JSONB NOT NULL,
      user_id INTEGER NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
      public BOOLEAN DEFAULT false,
      vegan BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TRIGGER update_recipes_updated_at
      BEFORE UPDATE ON public.recipes
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
    DROP TABLE IF EXISTS public.recipes;
    DROP TABLE IF EXISTS public."user";
    DROP FUNCTION IF EXISTS set_updated_at();
  `);
};
