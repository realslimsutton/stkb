// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  type AnyPgColumn,
  bigint,
  index,
  integer,
  pgTableCreator,
  serial,
  smallint,
  text,
  unique,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `stkb_${name}`);

export const workers = createTable(
  "workers",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    title: text("title").notNull(),
    image: text("image").notNull(),
    levelRequired: smallint("level_required").notNull().default(1),
    gold: bigint("gold", { mode: "number" }).notNull().default(0),
    gem: integer("gem").notNull().default(0),
  },
  (table) => ({
    titleNameIndex: unique("workers_title_name_idx").on(
      table.title,
      table.name,
    ),
    levelRequiredIndex: index("workers_level_required_idx").on(
      table.levelRequired,
    ),
    goldIndex: index("workers_gold_idx").on(table.gold),
    gemIndex: index("workers_gem_idx").on(table.gem),
  }),
);

export const components = createTable("components", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
});

export const blueprints = createTable(
  "blueprints",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    image: text("image").notNull(),
    type: text("type").notNull(),
    tier: integer("tier").notNull(),
    value: bigint("value", { mode: "number" }).notNull(),
    prerequisite: text("prerequisite"),
    researchScrolls: integer("research_scrolls").notNull().default(0),
    antiqueTokens: integer("antique_tokens").notNull().default(0),
    craftingTimeSeconds: bigint("crafting_time_seconds", {
      mode: "number",
    }).notNull(),
    merchantExperience: bigint("merchant_experience", {
      mode: "number",
    }).notNull(),
    workerExperience: integer("worker_experience").notNull(),
    fusionExperience: integer("fusion_experience").notNull(),
    favor: integer("favor").notNull(),
    airshipPower: integer("airship_power").notNull(),
    worker1: bigint("worker_1", { mode: "number" }).references(
      () => workers.id,
    ),
    worker1Level: smallint("worker_1_level"),
    worker2: bigint("worker_2", { mode: "number" }).references(
      () => workers.id,
    ),
    worker2Level: smallint("worker_2_level"),
    worker3: bigint("worker_3", { mode: "number" }).references(
      () => workers.id,
    ),
    worker3Level: smallint("worker_3_level"),
    stone: smallint("stone").notNull().default(0),
    wood: smallint("wood").notNull().default(0),
    leather: smallint("leather").notNull().default(0),
    herb: smallint("herb").notNull().default(0),
    steel: smallint("metal").notNull().default(0),
    ironwood: smallint("ironwood").notNull().default(0),
    fabric: smallint("fabric").notNull().default(0),
    oil: smallint("oil").notNull().default(0),
    mana: smallint("mana").notNull().default(0),
    gems: smallint("gems").notNull().default(0),
    essence: smallint("essence").notNull().default(0),
    blueprint1: bigint("blueprint_1", { mode: "number" }).references(
      (): AnyPgColumn => blueprints.id,
    ),
    blueprint1Quality: smallint("blueprint_1_quality"),
    component1: bigint("component_1", { mode: "number" }).references(
      () => components.id,
    ),
    componentBlueprint1Quantity: smallint("component_blueprint_1_quantity"),
    blueprint2: bigint("blueprint_2", { mode: "number" }).references(
      (): AnyPgColumn => blueprints.id,
    ),
    blueprint2Quality: smallint("blueprint_2_quality"),
    component2: bigint("component_2", { mode: "number" }).references(
      () => components.id,
    ),
    componentBlueprint2Quantity: smallint("component_blueprint_2_quantity"),
    attack: integer("attack"),
    defense: integer("defense"),
    health: integer("health"),
    evasion: integer("evasion"),
    crit: integer("crit"),
    element: text("element"),
    spirit: bigint("spirit", { mode: "number" }).references(
      (): AnyPgColumn => blueprints.id,
    ),
  },
  (table) => ({
    nameIndex: unique("blueprints_name_idx").on(table.name),
    typeIndex: index("blueprints_type_idx").on(table.type),
    tierIndex: index("blueprints_tier_idx").on(table.tier),
    valueIndex: index("blueprints_value_idx").on(table.value),
    prerequisiteIndex: index("blueprints_prerequisite_idx").on(
      table.prerequisite,
    ),
    researchScrollsIndex: index("blueprints_research_scrolls_idx").on(
      table.researchScrolls,
    ),
    antiqueTokensIndex: index("blueprints_antique_tokens_idx").on(
      table.antiqueTokens,
    ),
    craftingTimeSecondsIndex: index("blueprints_crafting_time_seconds_idx").on(
      table.craftingTimeSeconds,
    ),
    merchantExperienceIndex: index("blueprints_merchant_experience_idx").on(
      table.merchantExperience,
    ),
    workerExperienceIndex: index("blueprints_worker_experience_idx").on(
      table.workerExperience,
    ),
    fusionExperienceIndex: index("blueprints_fusion_experience_idx").on(
      table.fusionExperience,
    ),
    favorIndex: index("blueprints_favor_idx").on(table.favor),
    airshipPowerIndex: index("blueprints_airship_power_idx").on(
      table.airshipPower,
    ),
    worker1Index: index("blueprints_worker_1_idx").on(table.worker1),
    worker1LevelIndex: index("blueprints_worker_1_level_idx").on(
      table.worker1Level,
    ),
    worker2Index: index("blueprints_worker_2_idx").on(table.worker2),
    worker2LevelIndex: index("blueprints_worker_2_level_idx").on(
      table.worker2Level,
    ),
    worker3Index: index("blueprints_worker_3_idx").on(table.worker3),
    worker3LevelIndex: index("blueprints_worker_3_level_idx").on(
      table.worker3Level,
    ),
    stoneIndex: index("blueprints_stone_idx").on(table.stone),
    woodIndex: index("blueprints_wood_idx").on(table.wood),
    leatherIndex: index("blueprints_leather_idx").on(table.leather),
    herbIndex: index("blueprints_herb_idx").on(table.herb),
    steelIndex: index("blueprints_steel_idx").on(table.steel),
    ironwoodIndex: index("blueprints_ironwood_idx").on(table.ironwood),
    fabricIndex: index("blueprints_fabric_idx").on(table.fabric),
    oilIndex: index("blueprints_oil_idx").on(table.oil),
    manaIndex: index("blueprints_mana_idx").on(table.mana),
    gemsIndex: index("blueprints_gems_idx").on(table.gems),
    essenceIndex: index("blueprints_essence_idx").on(table.essence),
    blueprint1Index: index("blueprints_blueprint_1_idx").on(table.blueprint1),
    component1Index: index("blueprints_component_1_idx").on(table.component1),
    blueprint2Index: index("blueprints_blueprint_2_idx").on(table.blueprint2),
    component2Index: index("blueprints_component_2_idx").on(table.component2),
    attackIndex: index("blueprints_attack_idx").on(table.attack),
    defenseIndex: index("blueprints_defense_idx").on(table.defense),
    healthIndex: index("blueprints_health_idx").on(table.health),
    evasionIndex: index("blueprints_evasion_idx").on(table.evasion),
    critIndex: index("blueprints_crit_idx").on(table.crit),
    elementIndex: index("blueprints_element_idx").on(table.element),
    spiritIndex: index("blueprints_spirit_idx").on(table.spirit),
  }),
);
