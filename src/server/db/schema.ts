// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  type AnyPgColumn,
  bigint,
  bigserial,
  boolean,
  index,
  integer,
  json,
  jsonb,
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

export const blueprints = createTable(
  "blueprints",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull(),
    image: text("image"),
    category: text("string").notNull(),
    type: text("type").notNull(),
    subtype: text("subtype"),
    level: smallint("level").notNull().default(1),
    tier: smallint("tier").notNull().default(1),
    subtier: smallint("subtier").notNull().default(0),
    experience: bigint("experience", { mode: "number" }).notNull().default(0),
    craftExperience: bigint("craft_experience", { mode: "number" })
      .notNull()
      .default(0),
    value: bigint("value", { mode: "number" }).notNull().default(0),
    favor: smallint("favor").notNull().default(0),
    time: bigint("time", { mode: "number" }).notNull().default(0),
    attack: integer("atk").notNull().default(0),
    defence: integer("def").notNull().default(0),
    health: integer("hp").notNull().default(0),
    evasion: text("evasion").notNull().default("0"),
    crit: text("crit").notNull().default("0"),
    tradeMinValue: jsonb("trade_min_value")
      .$type<number[]>()
      .notNull()
      .default([]),
    tradeMaxValue: jsonb("trade_max_value")
      .$type<number[]>()
      .notNull()
      .default([]),
    worker1: text("worker_1").notNull(),
    worker1Level: smallint("worker_1_level").notNull().default(1),
    worker2: text("worker_2"),
    worker2Level: smallint("worker_2_level").notNull().default(1),
    worker3: text("worker_3"),
    worker3Level: smallint("worker_3_level").notNull().default(1),
    resource1: text("resource_1").notNull(),
    resource1Qty: bigint("resource_1_qty", { mode: "number" }).notNull(),
    resource2: text("resource_2"),
    resource2Qty: bigint("resource_2_qty", { mode: "number" })
      .notNull()
      .default(0),
    resource3: text("resource_3"),
    resource3Qty: bigint("resource_3_qty", { mode: "number" })
      .notNull()
      .default(0),
    component1: text("component_1"),
    component1Qty: bigint("component_1_qty", { mode: "number" })
      .notNull()
      .default(0),
    component2: text("component_2"),
    component2Qty: bigint("component_2_qty", { mode: "number" })
      .notNull()
      .default(0),
    element: text("element"),
    spirit: text("spirit"),
    discountEnergy: integer("discount_energy").notNull().default(0),
    surchargeEnergy: integer("surcharge_energy").notNull().default(0),
    suggestEnergy: integer("suggest_energy").notNull().default(0),
    speedupEnergy: integer("speedup_energy").notNull().default(0),
    isTitanItem: boolean("is_titan_item").notNull().default(false),
  },
  (table) => ({
    nameIndex: unique("blueprints_name_idx").on(table.name),
    typeIndex: index("blueprints_type_idx").on(table.type),
    subtypeIndex: index("blueprints_subtype_idx").on(table.subtype),
    levelIndex: index("blueprints_level_idx").on(table.level),
    tierIndex: index("blueprints_tier_idx").on(table.tier),
    subtierIndex: index("blueprints_subtier_idx").on(table.subtier),
    experienceIndex: index("blueprints_experience_idx").on(table.experience),
    craftExperienceIndex: index("blueprints_craft_experience_idx").on(
      table.craftExperience,
    ),
    valueIndex: index("blueprints_value_idx").on(table.value),
    favorIndex: index("blueprints_favor_idx").on(table.favor),
    timeIndex: index("blueprints_time_idx").on(table.time),
    attackIndex: index("blueprints_atk_idx").on(table.attack),
    defenceIndex: index("blueprints_def_idx").on(table.defence),
    healthIndex: index("blueprints_hp_idx").on(table.health),
    evasionIndex: index("blueprints_evasion_idx").on(table.evasion),
    critIndex: index("blueprints_crit_idx").on(table.crit),
    tradeMinMaxValueIndex: index("blueprints_trade_min_max_value_idx").on(
      table.tradeMinValue,
      table.tradeMaxValue,
    ),
    workerIndex: index("blueprints_workers_idx").on(
      table.worker1,
      table.worker1Level,
      table.worker2,
      table.worker2Level,
      table.worker3,
      table.worker3Level,
    ),
    resourceIndex: index("blueprints_resource_idx").on(
      table.resource1,
      table.resource1Qty,
      table.resource2,
      table.resource2Qty,
      table.resource3,
      table.resource3Qty,
    ),
    elementIndex: index("blueprints_element_idx").on(table.element),
    spiritIndex: index("blueprints_spirit_idx").on(table.spirit),
    discountEnergyIndex: index("blueprints_discount_energy_idx").on(
      table.discountEnergy,
    ),
    surchargeEnergyIndex: index("blueprints_surcharge_energy_idx").on(
      table.surchargeEnergy,
    ),
    suggestEnergyIndex: index("blueprints_suggest_energy_idx").on(
      table.suggestEnergy,
    ),
    speedupEnergyIndex: index("blueprints_speedup_energy_idx").on(
      table.speedupEnergy,
    ),
  }),
);

export const heroStats = createTable(
  "hero_stats",
  {
    id: bigserial("id", { mode: "number" }).notNull().primaryKey(),
    class: text("class").notNull(),
    stat: text("stat").notNull(),
    level: smallint("level").notNull(),
    value: integer("value").notNull(),
  },
  (table) => ({
    uniqueIndex: unique("hero_stats_unique_idx").on(
      table.class,
      table.stat,
      table.level,
    ),
  }),
);
