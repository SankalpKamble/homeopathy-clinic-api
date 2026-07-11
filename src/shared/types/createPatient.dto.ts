import { IsString, IsNumber, IsDate, IsEnum } from "class-validator";
import { GenderEnum } from "src/shared/enum";

export class CreatePatientDto {

    @IsString()
    patientName : string;

    @IsNumber()
    age : number;

    @IsString()
    @IsEnum(GenderEnum)
    gender : GenderEnum;

    @IsDate()
    dob: Date;

    @IsString()
    contact : string;

    @IsString()
    email : string;

    @IsString()
    address : string;

    @IsString()
    familyHistory : string;

    @IsString()
    pastMedicalHistory : string;

    @IsString()
    medicines : string;

    @IsString()
    reportFile : string;
}