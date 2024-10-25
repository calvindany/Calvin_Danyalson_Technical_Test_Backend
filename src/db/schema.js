const { sql } = require('drizzle-orm');
const { bigint, int, boolean, mysqlTable, serial, text, uniqueIndex, varchar, datetime, mysqlEnum, date } = require("drizzle-orm/mysql-core");

exports.Internals = mysqlTable('ms_internals', {
    pk_ms_internal: int("pk_ms_internal").primaryKey().autoincrement(),
    fullname: varchar('full_name', {length: 255}).notNull(),
    username: varchar('email', {length: 30}).unique().notNull(),
    phone_number: varchar("phone_number", {length: 25}).notNull(),
    password: text("fk_ms_role").notNull(),
    created_by: int("created_by").notNull(),
    created_at: datetime("created_at").default(sql`now()`),
})

exports.Roles = mysqlTable("ms_roles", {
    pk_ms_category: int('pk_ms_role').primaryKey().autoincrement(),
    name: varchar("name", { length: 20 }).notNull(),
    updated_at: int("created_by"),
    created_at: datetime("created_at").default(sql`now()`),
})

exports.Users = mysqlTable("ms_users", {
    pk_ms_user: int('pk_ms_user').primaryKey().autoincrement(),
    full_name: varchar("full_name", {length: 255}).notNull(),
    email: varchar("email", {length: 150}).notNull(),
    phone_number: varchar("phone_number", { length: 25 }).notNull(),
    created_by: int("created_by").notNull(),
    created_at: datetime("created_at").default(sql`now()`),
})

exports.LogsSuspended = mysqlTable("tr_logs_suspended", {
    pk_tr_logs_suspended: int('pk_tr_logs_suspended').primaryKey().autoincrement(),
    fk_ms_internal: int("fk_ms_internal").notNull().references(() => Internals.pk_ms_internal),
    start_date: datetime("start_date").notNull(),
    end_date: datetime("end_date").notNull(),
    created_by: int("created_by").notNull(),
    created_at: datetime("created_at").default(sql`now()`),
})

exports.Status = mysqlTable("ms_status", {
    pk_ms_status: int('pk_ms_status').primaryKey().autoincrement(),
    status_name: varchar("status_name", {length: 100}).notNull(),
    created_by: int("created_by").notNull(),
    created_at: datetime("created_at").default(sql`now()`),
})

exports.Leads = mysqlTable("tr_leads", {
    pk_tr_lead: int('pk_tr_lead').primaryKey().autoincrement(),
    client_email: varchar("client_email", { length: 150 }).notNull(),
    client_phone_number: varchar("client_phone_number", { length: 25 }).notNull(),
    fk_ms_status: int("fk_ms_status").notNull().references(() => Status.pk_ms_status),
    assigned: int("assigned").notNull().references(() => Internals.pk_ms_internal),
    excluded_sales_person: text("excluded_sales_person"),
    created_by: int("created_by").notNull(),
    created_at: datetime("created_at").default(sql`now()`),
})

exports.Survey = mysqlTable("tr_survey", {
    pk_tr_survey: int('pk_tr_survey').primaryKey().autoincrement(),
    fk_tr_lead: int("fk_tr_lead").notNull().references(() => Leads.pk_tr_lead),
    survey_request_notes: text("survey_request_notes").notNull(),
    survey_result_notes: text("survey_result_notes").notNull(),
    image_path: text("image_path").notNull(),
    status: mysqlEnum(["On Review", "Rejected", "Accepted"]).notNull().default("On Review"),
    created_by: int("created_by").notNull(),
    created_at: datetime("created_at").default(sql`now()`),
})

exports.FollowUp = mysqlTable("tr_follow_up", {
    pk_tr_follow_up: int("pk_tr_follow_up").primaryKey().autoincrement(),
    fk_tr_lead: int("fk_tr_lead").notNull().references(() => Leads.pk_tr_lead),
    follow_up_message: text("follow_up_message").notNull(),
    follow_up_result: text("follow_up_result").notNull(),
    created_by: int("created_by").notNull(),
    created_at: datetime("created_at").default(sql`now()`)
})
