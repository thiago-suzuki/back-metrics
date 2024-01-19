import { ApiProperty } from "@nestjs/swagger";
export class MetricsDTO {
    @ApiProperty()
    mrrArr: DataDTO[]
    @ApiProperty()
    churnRateArr: DataDTO[]
}

class DataDTO{
    month: string;
    value: number;
}