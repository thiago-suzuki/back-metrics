import { Body, Controller, Get, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MetricsDTO } from './dto/charge.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/charge')
@ApiTags('Charge')
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}

  @Post('metrics')
  @ApiOperation({ summary: 'Retornar as métricas CR e MRR' })
  @ApiResponse({
    status: 200,
    isArray: true,
    type: MetricsDTO,
  })
  @UseInterceptors(FileInterceptor('xlsx_file'))
  @ApiConsumes('multipart/form-data')
  async getMetrics(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    ) file: Express.Multer.File
  ) {
    return await this.chargeService.getMetrics(file);
  }
}
