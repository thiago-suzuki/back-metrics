import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class MetricsDTO {
    @ApiProperty()
    mrrArr: DataDTO[]
    @ApiProperty()
    churnRateArr: DataDTO[]
}

export class MetricsParamsDTO {
    @ApiProperty()
    file: File;
}

class DataDTO{
    month: string;
    value: number;
}