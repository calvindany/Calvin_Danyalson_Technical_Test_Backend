CREATE TABLE `tr_follow_up` (
	`pk_tr_follow_up` int AUTO_INCREMENT NOT NULL,
	`fk_tr_lead` int NOT NULL,
	`follow_up_message` text NOT NULL,
	`follow_up_result` text NOT NULL,
	`created_by` int NOT NULL,
	`created_at` datetime,
	CONSTRAINT `tr_follow_up_pk_tr_follow_up` PRIMARY KEY(`pk_tr_follow_up`)
);
--> statement-breakpoint
ALTER TABLE `tr_follow_up` ADD CONSTRAINT `tr_follow_up_fk_tr_lead_tr_leads_pk_tr_lead_fk` FOREIGN KEY (`fk_tr_lead`) REFERENCES `tr_leads`(`pk_tr_lead`) ON DELETE no action ON UPDATE no action;