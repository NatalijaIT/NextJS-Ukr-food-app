const sql = require('better-sqlite3');
const db = sql('meals.db');

const dummyMeals = [
   {
      title: 'Ukrainian Borscht',
      slug: 'ukrainian-borscht',
      image: 'borscht.jpg',
      summary:
         'Borscht is the most iconic Ukrainian soup made with beets, vegetables, and meat. It is known for its deep red color and rich, hearty flavor.',
      instructions: `
      1. Boil beef or pork broth.

      2. Add diced potatoes, shredded cabbage, grated beets, carrots, and onions sautéed with tomato paste.

      3. Simmer until tender and finish with garlic and herbs.

      4. Serve hot with sour cream.`,
      creator: 'John Doe',
      creator_email: 'johndoe@example.com',
   },
   {
      title: 'Varenyky (Ukrainian Dumplings)',
      slug: 'varenyky',
      image: 'varenyky.jpg',
      summary:
         'Varenyky are traditional Ukrainian dumplings filled with potatoes, cheese, cabbage, or cherries, and served with sour cream or butter.',
      instructions: `
      1. Prepare dough from flour, water and salt.

      2. Fill with mashed potatoes or other fillings.

      3. Boil until they float, then serve with butter, fried onions, or sour cream.
    `,
      creator: 'John Smith',
      creator_email: 'smith@example.com',
   },
   {
      title: 'Holubtsi (Stuffed Cabbage Rolls)',
      slug: 'holubtsi',
      image: 'holubtsi.jpg',
      summary:
         'Holubtsi are cabbage leaves stuffed with a mixture of rice and meat, slow-cooked in tomato sauce for a comforting, home-style dish.',
      instructions: `
      1. Blanch cabbage leaves.

      2. Fill with minced meat and rice mixture.

      3. Roll tightly, place in a pot.

      4. Cover with tomato sauce, and simmer until fully cooked.
    `,
      creator: 'Rebeca Dickson',
      creator_email: 'rebeca@example.com',
   },
   {
      title: 'Deruny (Potato Pancakes)',
      slug: 'deruny',
      image: 'deruny.jpg',
      summary:
         "Deruny are crispy Ukrainian potato pancakes, especially popular in northern regions of Ukraine and often served with sour cream.",
      instructions: `
      1. Grate raw potatoes and onion.

      2. Mix with egg, flour, salt, and pepper.

      3. Fry spoonfuls in hot oil until golden brown on both sides.
    `,
      creator: 'Laura Smith',
      creator_email: 'laurasmith@example.com',
   },
   {
      title: 'Syrnyky (Cheese Pancakes)',
      slug: 'syrnyky',
      image: 'syrnyky.jpg',
      summary:
         'Syrnyky are soft cottage cheese pancakes, lightly sweetened and commonly served for breakfast or dessert with jam or sour cream.',
      instructions: `
      1. Mix cottage cheese with egg, sugar, flour, and vanilla.

      2. Shape into small pancakes and fry until golden.

      3. Serve warm with sour cream or honey.
    `,
      creator: 'Mario Te',
      creator_email: 'mario@example.com',
   }
];

db.prepare(`
   CREATE TABLE IF NOT EXISTS meals (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       slug TEXT NOT NULL UNIQUE,
       title TEXT NOT NULL,
       image TEXT NOT NULL,
       summary TEXT NOT NULL,
       instructions TEXT NOT NULL,
       creator TEXT NOT NULL,
       creator_email TEXT NOT NULL
    )
`).run();

async function initData() {
   const stmt = db.prepare(`
      INSERT INTO meals VALUES (
         null,
         @slug,
         @title,
         @image,
         @summary,
         @instructions,
         @creator,
         @creator_email
      )
   `);

   for (const meal of dummyMeals) {
      stmt.run(meal);
   }
}

initData();