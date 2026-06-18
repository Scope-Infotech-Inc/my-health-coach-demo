/**
 * Authored ingredients/steps for the 14 seeded recipes (FR-29 requires a
 * detail view with both; the seed JSON does not provide them). AUTHORED
 * CONTENT RULES: each list is consistent with the recipe's declared
 * allergens[] (nothing containing an undeclared allergen — incl. tree nuts,
 * sesame, gluten-adjacent items kept out where not declared), diet[]
 * (vegetarian: no meat/fish; vegan: no animal products), conditionTags
 * (low_sodium recipes use no-salt-added items), and approximate macros.
 * Deterministic literals — never generated at runtime.
 */
export const RECIPE_DETAILS: Record<string, { ingredients: string[]; steps: string[] }> = {
  r1: {
    // fish · diabetes_friendly, heart_healthy, low_sodium
    ingredients: [
      '2 salmon fillets (5 oz each)',
      '1 lemon, half juiced and half sliced',
      '2 cups broccoli florets',
      '2 cups chopped kale',
      '1 tablespoon olive oil',
      '2 cloves garlic, minced',
      'Black pepper to taste',
    ],
    steps: [
      'Heat the oven to 400°F and line a sheet pan with parchment.',
      'Toss the broccoli and kale with the olive oil, garlic, and pepper. Spread on the pan.',
      'Place the salmon on top. Add the lemon juice and lay the slices over the fillets.',
      'Roast 15–18 minutes, until the salmon flakes easily.',
      'Serve warm. No added salt is needed — the lemon and garlic carry the flavor.',
    ],
  },
  r2: {
    // none · vegan · diabetes_friendly, high_fiber, weight_management, low_sodium
    ingredients: [
      '1 can (15 oz) no-salt-added chickpeas, rinsed',
      '4 cups fresh spinach',
      '1 onion, diced',
      '2 cloves garlic, minced',
      '1 tablespoon grated ginger',
      '2 teaspoons curry powder',
      '1 cup light coconut milk',
      '1 cup cooked brown rice',
    ],
    steps: [
      'Cook the onion in a splash of water or oil over medium heat until soft, about 5 minutes.',
      'Add the garlic, ginger, and curry powder. Stir for 1 minute.',
      'Add the chickpeas and coconut milk. Simmer 10 minutes.',
      'Stir in the spinach until it wilts.',
      'Serve over the brown rice.',
    ],
  },
  r3: {
    // shellfish · diabetes_friendly, high_protein
    ingredients: [
      '10 oz shrimp, peeled and deveined',
      '1 cup quinoa, rinsed',
      '1 cucumber, diced',
      '1 cup cherry tomatoes, halved',
      '1 tablespoon olive oil',
      '1 lemon, juiced',
      '2 tablespoons chopped fresh dill or parsley',
    ],
    steps: [
      'Cook the quinoa in 2 cups of water, about 15 minutes. Fluff and cool slightly.',
      'Toss the shrimp with half the olive oil. Grill or sear 2–3 minutes per side.',
      'Combine the quinoa, cucumber, and tomatoes in bowls.',
      'Top with the shrimp. Dress with lemon juice, the remaining oil, and herbs.',
    ],
  },
  r4: {
    // peanut, soy · vegetarian · weight_management, high_protein
    ingredients: [
      '14 oz extra-firm tofu, pressed and cubed',
      '⅓ cup crushed peanuts',
      '2 tablespoons low-sodium soy sauce',
      '2 cups broccoli florets',
      '1 red bell pepper, sliced',
      '1 tablespoon cornstarch',
      '1 tablespoon canola oil',
      '1 cup cooked brown rice',
    ],
    steps: [
      'Toss the tofu with the cornstarch, then press into the crushed peanuts.',
      'Heat the oil in a large skillet. Brown the tofu on all sides, about 6 minutes. Set aside.',
      'Stir-fry the broccoli and bell pepper 4 minutes.',
      'Return the tofu, add the soy sauce, and toss for 1 minute.',
      'Serve over the brown rice.',
    ],
  },
  r5: {
    // none · vegan · diabetes_friendly, high_fiber, low_sodium, weight_management
    ingredients: [
      '1 cup dried brown lentils, rinsed',
      '2 carrots, diced',
      '2 celery stalks, diced',
      '1 onion, diced',
      '1 can (14 oz) no-salt-added diced tomatoes',
      '4 cups low-sodium vegetable broth',
      '1 teaspoon dried thyme',
      'Black pepper to taste',
    ],
    steps: [
      'Cook the onion, carrots, and celery in a soup pot over medium heat until soft, about 6 minutes.',
      'Add the lentils, tomatoes, broth, and thyme.',
      'Bring to a boil, then simmer 25 minutes until the lentils are tender.',
      'Season with pepper and serve.',
    ],
  },
  r6: {
    // milk · vegetarian · diabetes_friendly, low_sodium, high_protein
    ingredients: [
      '1 cup plain nonfat Greek yogurt',
      '½ cup blueberries',
      '½ cup sliced strawberries',
      '3 tablespoons rolled oats, toasted',
      '1 teaspoon chia seeds',
      '¼ teaspoon cinnamon',
    ],
    steps: [
      'Spoon half the yogurt into a glass or jar.',
      'Layer half the berries and half the oats on top.',
      'Repeat the layers with the remaining yogurt, berries, and oats.',
      'Finish with the chia seeds and cinnamon.',
    ],
  },
  r7: {
    // none · vegan · high_fiber, weight_management, low_sodium
    ingredients: [
      '1 large sweet potato, diced small',
      '1 can (15 oz) no-salt-added black beans, rinsed',
      '6 corn tortillas',
      '1 teaspoon ground cumin',
      '1 lime, cut into wedges',
      '1 cup shredded cabbage',
      '½ avocado, sliced',
    ],
    steps: [
      'Roast the sweet potato at 425°F for 20 minutes, tossing once.',
      'Warm the black beans with the cumin in a small pan.',
      'Heat the tortillas in a dry skillet.',
      'Fill each tortilla with sweet potato, beans, cabbage, and avocado.',
      'Squeeze lime over the top and serve.',
    ],
  },
  r8: {
    // none · diabetes_friendly, high_protein, low_sodium
    ingredients: [
      '2 boneless chicken breasts (6 oz each)',
      '1 tablespoon olive oil',
      '1 teaspoon dried rosemary',
      '1 teaspoon dried thyme',
      '2 carrots, cut into sticks',
      '1 zucchini, sliced',
      '1 red onion, cut into wedges',
      'Black pepper to taste',
    ],
    steps: [
      'Heat the oven to 425°F.',
      'Toss the vegetables with half the oil and spread on a sheet pan.',
      'Rub the chicken with the remaining oil, the herbs, and pepper. Place on the pan.',
      'Roast 22–25 minutes, until the chicken reaches 165°F.',
      'Rest 5 minutes, slice, and serve with the vegetables.',
    ],
  },
  r9: {
    // egg, soy · vegetarian · diabetes_friendly, weight_management, low_carb
    ingredients: [
      '4 cups riced cauliflower',
      '2 eggs, lightly beaten',
      '2 tablespoons low-sodium soy sauce',
      '½ cup frozen peas',
      '1 carrot, finely diced',
      '2 green onions, sliced',
      '1 tablespoon canola oil',
    ],
    steps: [
      'Heat the oil in a large skillet over medium-high heat.',
      'Cook the carrot and peas 3 minutes.',
      'Push the vegetables aside, pour in the eggs, and scramble until set.',
      'Add the cauliflower and soy sauce. Stir-fry 4–5 minutes.',
      'Top with the green onions and serve.',
    ],
  },
  r10: {
    // fish · diabetes_friendly, heart_healthy, high_protein
    ingredients: [
      '2 cans (5 oz each) tuna in water, drained',
      '1 can (15 oz) no-salt-added cannellini beans, rinsed',
      '¼ red onion, thinly sliced',
      '2 tablespoons chopped parsley',
      '1 lemon, juiced',
      '1 tablespoon olive oil',
      '3 cups arugula',
    ],
    steps: [
      'Combine the tuna, beans, onion, and parsley in a bowl.',
      'Whisk the lemon juice and olive oil, and toss with the tuna mixture.',
      'Serve over the arugula.',
    ],
  },
  r11: {
    // milk · vegetarian · diabetes_friendly, high_fiber, low_sodium
    ingredients: [
      '½ cup rolled oats',
      '1 tablespoon chia seeds',
      '¾ cup low-fat milk',
      '½ apple, diced',
      '¼ teaspoon cinnamon',
    ],
    steps: [
      'Stir the oats, chia seeds, milk, and cinnamon together in a jar.',
      'Fold in the apple.',
      'Cover and refrigerate overnight (at least 4 hours).',
      'Stir and eat cold, or warm it for one minute.',
    ],
  },
  r12: {
    // none · vegan · high_fiber, weight_management, low_sodium, heart_healthy
    ingredients: [
      '4 bell peppers, tops removed and seeded',
      '1 cup cooked brown rice',
      '1 can (15 oz) no-salt-added black beans, rinsed',
      '1 onion, diced',
      '1 cup no-salt-added tomato sauce',
      '1 teaspoon ground cumin',
      '2 cups fresh spinach, chopped',
    ],
    steps: [
      'Heat the oven to 375°F.',
      'Cook the onion until soft, then stir in the beans, rice, tomato sauce, cumin, and spinach.',
      'Stand the peppers in a baking dish and fill them with the mixture.',
      'Cover with foil and bake 30 minutes; uncover and bake 10 more.',
      'Cool 5 minutes before serving.',
    ],
  },
  r13: {
    // soy · vegan · weight_management, high_fiber, high_protein
    ingredients: [
      '1 cup shelled edamame, cooked',
      '1 cup cooked brown rice',
      '1 cup broccoli florets, steamed',
      '1 carrot, ribboned',
      '1 cup shredded red cabbage',
      '1 tablespoon olive oil',
      '1 tablespoon rice vinegar',
      '1 teaspoon grated ginger',
    ],
    steps: [
      'Arrange the rice, edamame, broccoli, carrot, and cabbage in a bowl.',
      'Whisk the oil, vinegar, and ginger into a dressing.',
      'Drizzle over the bowl and serve.',
    ],
  },
  r14: {
    // fish · diabetes_friendly, heart_healthy, low_sodium, low_carb
    ingredients: [
      '2 cod fillets (6 oz each)',
      '1 bunch asparagus, trimmed',
      '1 tablespoon olive oil',
      '1 lemon, half juiced and half sliced',
      '2 cloves garlic, minced',
      '½ teaspoon paprika',
      'Black pepper to taste',
    ],
    steps: [
      'Heat the oven to 400°F.',
      'Toss the asparagus with half the oil and the garlic. Spread on a sheet pan.',
      'Place the cod on the pan. Brush with the remaining oil, then add the paprika, pepper, and lemon.',
      'Bake 12–15 minutes, until the cod is opaque and flakes easily.',
    ],
  },
};
