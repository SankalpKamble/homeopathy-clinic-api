import { Controller, Get, Param, ParseIntPipe, UseGuards, Post, Body, UseInterceptors, Patch, Delete } from "@nestjs/common";
import { PatientService } from "src/app/core/service";
import { AuthGuard } from "src/app/auth/guard/auth.guard";
import { User } from "src/app/auth/decorators/user.decorator";
import { CreatePatientDto } from "src/shared/types/createPatient.dto";
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UpdatePatientDto } from "src/shared/types/updatePatient.dto";

@Controller(PatientController.api)
export class PatientController {
    static api = 'api';
    constructor(private readonly patientService: PatientService) {}

    @Get('/patients')
    @UseGuards(AuthGuard)
    async getAllPatients(@User() user: any) {
       return await this.patientService.getAllPatients(user.id);
    }

    @Get('/patients/:id')
    @UseGuards(AuthGuard)
    async getPatientById(
        @Param('id', ParseIntPipe) id: number,
        @User() user: any) {
        return await this.patientService.getPatientById(id, user.id);
    }

    @Post('/add-patient')
    @UseGuards(AuthGuard)
    @UseInterceptors(AnyFilesInterceptor()) 
    async createPatient(
        @Body() patientData: CreatePatientDto,
        @User() user: any
    ) {
        return await this.patientService.createPatient(patientData,user);
    }

    @Patch('/update-patient/:id')
    @UseGuards(AuthGuard)
    @UseInterceptors(AnyFilesInterceptor()) 
    async updatePatient(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdatePatientDto,
    @User() user: any
) {
    return this.patientService.updatePatient(id, updateData, user);
}

    @Delete('/delete-patient/:id')
    @UseGuards(AuthGuard)
    async deletePatient(
        @Param('id', ParseIntPipe) id: number,
        @User() user: any
    ) {
        return this.patientService.deletePatient(id, user);
    }
}