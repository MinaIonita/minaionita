import { Module } from "@nestjs/common";
import {
  CredentialsController,
  ProjectsController,
} from "./projects.controller";
import { ProjectsService } from "./projects.service";

@Module({
  controllers: [ProjectsController, CredentialsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
