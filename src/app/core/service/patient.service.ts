import { Injectable, NotFoundException } from "@nestjs/common";
import { AppLogger } from "src/app/common";
import { PatientRepository } from "src/app/core/repository";
import { CreatePatientDto } from "src/shared/types";
import { UpdatePatientDto } from "src/shared/types/updatePatient.dto";

@Injectable()
export class PatientService {
    private readonly logger: AppLogger;
    constructor(private readonly patientRepository: PatientRepository) {
        this.logger = new AppLogger(PatientService.name, 'PATIENT_LOG_PREFIX');
    }

    async getAllPatients(userId: string) {
        const users = await this.patientRepository.getAllPatients(userId);
        if (!users || users.length === 0) {
            this.logger.warn(`No patients found`);
            throw new NotFoundException('No patients found');
        }
        this.logger.log(`Found ${users.length} patients`);
        return users;
    }

    async getPatientById(id: number, userId: string) {
        const patient = await this.patientRepository.getPatientById(id, userId);
        if (!patient) {
            this.logger.log(`Patient with ID ${id} not found for user ${userId}`);
            throw new NotFoundException('Patient not found');
        }
        return patient;
    }

    async createPatient(patientData: CreatePatientDto, user: any) {
        this.logger.log(`Creating a new patient`);
        const newPatient = await this.patientRepository.createPatient(patientData,user.id);
        if (!newPatient) {
            this.logger.warn(`Failed to create a new patient`);
            throw new Error('Failed to create a new patient');
        }
        this.logger.log(`Created new patient with ID ${newPatient.id} for Doctor: ${user.email}`);
        return newPatient;
    }

    async deletePatient(patientID: number, user: any) {
        this.logger.log(`Deleting patient ID: ${patientID} for Doctor ID: ${user.id}`);
        const deletedPatient = await this.patientRepository.deletePatient(patientID, user.id);
        this.logger.log(`Deleted patient ID: ${patientID} for Doctor: ${user.email}`);
        return deletedPatient;
    }

    async updatePatient(patientID: number,patientData: UpdatePatientDto, user: any) {
        this.logger.log(`Updating a patient with Patient ID: ${patientID} for Doctor ID: ${user.id}`);
        const updatedPatient = await this.patientRepository.updatePatient(patientID, patientData, user.id);
        if (!updatedPatient) {
            this.logger.warn(`Failed to update patient with ID: ${patientID}`);
            throw new Error('Failed to update patient');
        }
        this.logger.log(`Updated patient with ID ${updatedPatient.id} for Doctor: ${user.email}`);
        return updatedPatient;
    }

}