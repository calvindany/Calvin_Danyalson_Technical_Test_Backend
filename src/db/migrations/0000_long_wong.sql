CREATE TABLE `ms_internals` (
	`pk_ms_internal` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`email` varchar(30) NOT NULL,
	`phone_number` varchar(25) NOT NULL,
	`fk_ms_role` text NOT NULL,
	`created_by` int NOT NULL,
	`created_at` datetime DEFAULT now(),
	CONSTRAINT `ms_internals_pk_ms_internal` PRIMARY KEY(`pk_ms_internal`),
	CONSTRAINT `ms_internals_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `tr_leads` (
	`pk_tr_lead` int AUTO_INCREMENT NOT NULL,
	`client_email` varchar(150) NOT NULL,
	`client_phone_number` varchar(25) NOT NULL,
	`fk_ms_status` int NOT NULL,
	`assigned` int NOT NULL,
	`excluded_sales_person` text NOT NULL,
	`created_by` int NOT NULL,
	`created_at` datetime DEFAULT now(),
	CONSTRAINT `tr_leads_pk_tr_lead` PRIMARY KEY(`pk_tr_lead`)
);
--> statement-breakpoint
CREATE TABLE `tr_logs_suspended` (
	`pk_tr_logs_suspended` int AUTO_INCREMENT NOT NULL,
	`fk_ms_internal` int NOT NULL,
	`start_date` datetime NOT NULL,
	`end_date` datetime NOT NULL,
	`created_by` int NOT NULL,
	`created_at` datetime DEFAULT now(),
	CONSTRAINT `tr_logs_suspended_pk_tr_logs_suspended` PRIMARY KEY(`pk_tr_logs_suspended`)
);
--> statement-breakpoint
CREATE TABLE `ms_roles` (
	`pk_ms_role` int AUTO_INCREMENT NOT NULL,
	`name` varchar(20) NOT NULL,
	`created_by` int,
	`created_at` datetime DEFAULT now(),
	CONSTRAINT `ms_roles_pk_ms_role` PRIMARY KEY(`pk_ms_role`)
);
--> statement-breakpoint
CREATE TABLE `ms_status` (
	`pk_ms_status` int AUTO_INCREMENT NOT NULL,
	`status_name` varchar(100) NOT NULL,
	`created_by` int NOT NULL,
	`created_at` datetime DEFAULT now(),
	CONSTRAINT `ms_status_pk_ms_status` PRIMARY KEY(`pk_ms_status`)
);
--> statement-breakpoint
CREATE TABLE `tr_survey` (
	`pk_tr_survey` int AUTO_INCREMENT NOT NULL,
	`fk_tr_lead` int NOT NULL,
	`survey_notes` text NOT NULL,
	`status` enum('On Review','Rejected','Accepted') NOT NULL DEFAULT 'On Review',
	`created_by` int NOT NULL,
	`created_at` datetime DEFAULT now(),
	CONSTRAINT `tr_survey_pk_tr_survey` PRIMARY KEY(`pk_tr_survey`)
);
--> statement-breakpoint
CREATE TABLE `ms_users` (
	`pk_ms_user` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`email` varchar(150) NOT NULL,
	`phone_number` varchar(25) NOT NULL,
	`created_by` int NOT NULL,
	`created_at` datetime DEFAULT now(),
	CONSTRAINT `ms_users_pk_ms_user` PRIMARY KEY(`pk_ms_user`)
);
--> statement-breakpoint
ALTER TABLE `tr_leads` ADD CONSTRAINT `tr_leads_fk_ms_status_ms_status_pk_ms_status_fk` FOREIGN KEY (`fk_ms_status`) REFERENCES `ms_status`(`pk_ms_status`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tr_leads` ADD CONSTRAINT `tr_leads_assigned_ms_internals_pk_ms_internal_fk` FOREIGN KEY (`assigned`) REFERENCES `ms_internals`(`pk_ms_internal`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tr_logs_suspended` ADD CONSTRAINT `tr_logs_suspended_fk_ms_internal_ms_internals_pk_ms_internal_fk` FOREIGN KEY (`fk_ms_internal`) REFERENCES `ms_internals`(`pk_ms_internal`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tr_survey` ADD CONSTRAINT `tr_survey_fk_tr_lead_tr_leads_pk_tr_lead_fk` FOREIGN KEY (`fk_tr_lead`) REFERENCES `tr_leads`(`pk_tr_lead`) ON DELETE no action ON UPDATE no action;