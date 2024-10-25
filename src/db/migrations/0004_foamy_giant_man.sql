ALTER TABLE `tr_survey` RENAME COLUMN `survey_notes` TO `survey_request_notes`;--> statement-breakpoint
ALTER TABLE `tr_survey` ADD `survey_result_notes` text NOT NULL;--> statement-breakpoint
ALTER TABLE `tr_survey` ADD `image_path` text NOT NULL;