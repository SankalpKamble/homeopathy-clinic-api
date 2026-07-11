import { Injectable, NotFoundException } from "@nestjs/common";
import { DBPrismaClient } from "src/data-sources";
import { CreatePatientDto, UpdatePatientDto } from "src/shared/types";
import { stringToNumber } from "src/shared/utils";

@Injectable()
export class PatientRepository {
    constructor(
        private readonly prisma: DBPrismaClient
    ) { }

    // 1. Get all patients for a specific doctor
    async getAllPatients(docID: string) {
        return await this.prisma.patients.findMany({
            where: {
                docId: docID
            }
        });
    }

    // 2. Get a specific patient by ID for a specific doctor
    async getPatientById(id: number, docID: string) {
        return await this.prisma.patients.findFirst({
            where: {
                id: id,
                docId: docID
            }
        });
    }

    //3. Create a new patient
    async createPatient(patientData: CreatePatientDto,docId: string) {
        if (!patientData || !docId) {
            throw new Error('Invalid patient data or doctor ID');
        }
        const payload = await this.buildPayloadForCreatePatient(patientData, docId);
        return await this.prisma.patients.create({
            data: payload
        });
    }

    //4. Update an existing patient — only updates provided fields
    async updatePatient(id: number, data: UpdatePatientDto, docId: string) {
        const existingPatient = await this.getPatientById(id, docId);
        if (!existingPatient) {
            throw new NotFoundException('Patient not found');
        }

        const payload: Record<string, any> = {};
        if (data.patientName !== undefined) payload.patientName = data.patientName;
        if (data.age !== undefined) payload.age = stringToNumber(data.age);
        if (data.gender !== undefined) payload.gender = data.gender;
        if (data.dob !== undefined) payload.dob = data.dob;
        if (data.contact !== undefined) payload.contact = data.contact;
        if (data.email !== undefined) payload.email = data.email;
        if (data.address !== undefined) payload.address = data.address;
        if (data.familyHistory !== undefined) payload.familyHistory = data.familyHistory;
        if (data.pastMedicalHistory !== undefined) payload.pastMedicalHistory = data.pastMedicalHistory;
        if (data.medicines !== undefined) payload.medicines = data.medicines;
        if (data.reportFile !== undefined) payload.reportFile = data.reportFile;
        payload.lastVisitedDate = new Date();

        return await this.prisma.patients.update({
            where: {
                id,
                docId,
            },
            data: payload,
        });
    }

    //5. Delete a patient — ensures patient belongs to the given doctor
    async deletePatient(id: number, docId: string) {
        const existingPatient = await this.getPatientById(id, docId);
        if (!existingPatient) {
            throw new NotFoundException('Patient not found');
        }

        return await this.prisma.patients.delete({
            where: { id },
        });
    }

    private async buildPayloadForCreatePatient(data: CreatePatientDto, docId: string) {
        const payload = {
            patientName: data.patientName,
            age: stringToNumber(data.age),
            gender: data.gender,
            dob: data.dob,
            contact: data.contact,
            email: data.email,
            address: data.address,
            familyHistory: data.familyHistory,
            pastMedicalHistory: data.pastMedicalHistory,
            medicines: data.medicines,
            reportFile: data.reportFile,
            lastVisitedDate: new Date(),
            createdAt: new Date(),
            docId: docId
        };
        return payload;
    }
}