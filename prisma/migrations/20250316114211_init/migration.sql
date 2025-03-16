-- CreateEnum
CREATE TYPE "FedType" AS ENUM ('NATIONAL', 'REGIONAL');

-- CreateEnum
CREATE TYPE "ProfileType" AS ENUM ('PLAYER', 'FED_ADMIN', 'CLUB_MANAGER', 'COACH', 'ARBITER', 'TOURNAMENT_DIRECTOR', 'PARENT', 'STUDENT', 'VOLUNTEER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FED_ADMIN', 'CLUB_MANAGER', 'PLAYER', 'COACH', 'ARBITER', 'VOLUNTEER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('INDIVIDUAL', 'EVENT');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELED');

-- CreateEnum
CREATE TYPE "EventMode" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "EventFormat" AS ENUM ('SWISS', 'QUAD', 'TEAM');

-- CreateTable
CREATE TABLE "base_user" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "middle_name" VARCHAR(100),
    "name_suffix" VARCHAR(50),
    "gender" "Gender" NOT NULL,
    "federation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "base_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profile" (
    "id" TEXT NOT NULL,
    "base_user_id" TEXT NOT NULL,
    "profileType" "ProfileType" NOT NULL,
    "profileId" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club_manager" (
    "id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "club_manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player" (
    "id" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "avatar_url" TEXT,
    "age_proof" TEXT,
    "street_address" TEXT NOT NULL,
    "street_address2" TEXT,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "phone_number" TEXT,
    "country_code" TEXT,
    "fide_id" TEXT,
    "school_name" TEXT,
    "graduation_year" INTEGER,
    "grade_in_school" TEXT,
    "grade_date" TIMESTAMP(3),
    "club_name" TEXT,
    "clubId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "federation_admin" (
    "id" TEXT NOT NULL,
    "federation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "federation_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "federation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FedType" NOT NULL,
    "country" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "logo" TEXT,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "federation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "manager_id" TEXT NOT NULL,
    "federation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "federation_id" TEXT NOT NULL,
    "subscriber_id" TEXT NOT NULL,
    "type" "SubscriptionType" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "video" TEXT,
    "mode" "EventMode" NOT NULL,
    "venue" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "end_time" TEXT NOT NULL,
    "federation_id" TEXT NOT NULL,
    "format" "EventFormat" NOT NULL,
    "number_of_rounds" INTEGER NOT NULL,
    "is_rated" BOOLEAN NOT NULL,
    "time_control" TEXT,
    "brochure" TEXT,
    "about_event" TEXT,
    "prizes_awards" TEXT,
    "faq" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contact_info_id" TEXT NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entry_fee" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "entry_fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_info" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,

    CONSTRAINT "contact_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permission" (
    "admin_user_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_permission_pkey" PRIMARY KEY ("admin_user_id","permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "base_user_email_federation_id_key" ON "base_user"("email", "federation_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_base_user_id_key" ON "user_profile"("base_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_profileType_profileId_key" ON "user_profile"("profileType", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "club_manager_club_id_key" ON "club_manager"("club_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_fide_id_key" ON "player"("fide_id");

-- CreateIndex
CREATE UNIQUE INDEX "federation_admin_federation_id_key" ON "federation_admin"("federation_id");

-- CreateIndex
CREATE UNIQUE INDEX "federation_domain_key" ON "federation"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "club_manager_id_key" ON "club"("manager_id");

-- CreateIndex
CREATE UNIQUE INDEX "club_name_federation_id_key" ON "club"("name", "federation_id");

-- CreateIndex
CREATE UNIQUE INDEX "permission_name_key" ON "permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_code_key" ON "permission"("code");

-- AddForeignKey
ALTER TABLE "base_user" ADD CONSTRAINT "base_user_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_base_user_id_fkey" FOREIGN KEY ("base_user_id") REFERENCES "base_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_manager" ADD CONSTRAINT "club_manager_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "federation_admin" ADD CONSTRAINT "federation_admin_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club" ADD CONSTRAINT "club_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_contact_info_id_fkey" FOREIGN KEY ("contact_info_id") REFERENCES "contact_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry_fee" ADD CONSTRAINT "entry_fee_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permission" ADD CONSTRAINT "user_permission_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "user_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permission" ADD CONSTRAINT "user_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
