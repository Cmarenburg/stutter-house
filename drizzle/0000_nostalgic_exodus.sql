-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `role_permission` (
`roleId` text NOT NULL,
`permissionId` text NOT NULL,
FOREIGN KEY (`permissionId`) REFERENCES `permission`(`id`) ON UPDATE cascade ON DELETE cascade,
FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `role` (
`id` text PRIMARY KEY NOT NULL,
`name` text NOT NULL,
`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
`updatedAt` numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE `permission` (
`id` text PRIMARY KEY NOT NULL,
`name` text NOT NULL,
`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
`updatedAt` numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE `password` (
`hash` text NOT NULL,
`userId` text NOT NULL,
FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `verification` (
`id` text PRIMARY KEY NOT NULL,
`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
`type` text NOT NULL,
`target` text NOT NULL,
`secret` text NOT NULL,
`algorithm` text NOT NULL,
`digits` integer NOT NULL,
`period` integer NOT NULL,
`expiresAt` numeric
);
--> statement-breakpoint
CREATE TABLE `session` (
`id` text PRIMARY KEY NOT NULL,
`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
`userId` text NOT NULL,
`expirationDate` numeric NOT NULL,
FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
`id` text PRIMARY KEY NOT NULL,
`email` text NOT NULL,
`username` text NOT NULL,
`name` text,
`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
`updatedAt` numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_role` (
`userId` text NOT NULL,
`roleId` text NOT NULL,
FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON UPDATE cascade ON DELETE cascade,
FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);

*/
