ALTER TABLE `tr_survey` MODIFY COLUMN `status` enum('On Review','Rejected','Accepted','Completed') NOT NULL DEFAULT 'On Review';