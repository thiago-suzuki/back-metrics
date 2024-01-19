import { Injectable } from '@nestjs/common';
import { MetricsDTO, MetricsParamsDTO } from './dto/charge.dto';
import * as XLSX from 'xlsx';
import * as fs from 'fs'

@Injectable()
export class ChargeService {
    getMonthName(month: number) {
        const monthNames = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return monthNames[month];
    }

    monthToNumber(month: string) {
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return monthNames.findIndex(m => m === month) + 1;
    };

    consolidateEntries(array: { month: string; value: number }[]) {
        const consolidatedArray: { month: string; value: number }[] = [];
    
        array.forEach(entry => {
            const existingEntry = consolidatedArray.find(e => e.month === entry.month);
    
            if (existingEntry) {
                existingEntry.value += entry.value;
            } else {
                consolidatedArray.push({ month: entry.month, value: entry.value });
            }
        });
    
        return consolidatedArray;
    };

    orderByYearMonth(array: { month: string; value: number }[]) {
        return array.sort((a, b) => {
            const [monthA, yearA] = a.month.split(' ');
            const [monthB, yearB] = b.month.split(' ');
    
            if (parseInt(yearA) !== parseInt(yearB)) {
                return parseInt(yearA) - parseInt(yearB);
            }
    
            // Se o ano for o mesmo, comparar por mês
            return this.monthToNumber(monthA) - this.monthToNumber(monthB);
        });
    };

    convertValueToInt(array: { month: string; value: number }[]) {
        return array.map(item => ({
            month: item.month,
            value: parseInt(item.value.toString(), 10), // Converter para inteiro
        }));
    };
      

    async getMetrics(file: Express.Multer.File) : Promise<MetricsDTO> {
        let churnRateArray: { month: string; value: number }[] = [];
        let mrrArray: { month: string; value: number }[] = [];

        const workbook = XLSX.read(file.buffer, { type: 'buffer' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(worksheet);

        const monthlyData = data.reduce((acc: any, entry: any) => {
            const dateCode = parseFloat(entry['data status'] || entry['data status']);
            const dateObject = XLSX.SSF.parse_date_code(dateCode);
            const formattedDate = `${dateObject.y}/${dateObject.m + 1}/${dateObject.d}`;

            const monthYear = `${new Date(formattedDate).getMonth() + 1}/${new Date(formattedDate).getFullYear()}`;
            const monthYearFull = `${this.getMonthName(dateObject.m)} ${dateObject.y}`;
            

            if (entry['status'] === 'Cancelada') {
                acc.churnCount = (acc.churnCount || 0) + 1;
            }

            acc.customerCount = (acc.customerCount || 0) + 1;

            if (entry['valor']) {
                acc.mrr = (acc.mrr || 0) + parseFloat(entry['valor'].toString().replace(',', '.'));
            }

            if (acc.lastMonth !== monthYear) {
                if (acc.lastMonth) {
                    const churnRate = (acc.churnCount / acc.customerCount) * 100;
                    churnRateArray.push({
                        month: monthYearFull,
                        value: churnRate,
                    });

                    mrrArray.push({
                        month: monthYearFull,
                        value: acc.mrr,
                    });
                }
                acc.lastMonth = monthYear;
                acc.churnCount = 0;
                acc.customerCount = 0;
                acc.mrr = 0;
            }

            return acc;
        }, {});

        churnRateArray = churnRateArray.filter(value => value.value != 0 && !value.month.includes('1900')),
        mrrArray =  mrrArray.filter(value => value.value != 0 && !value.month.includes('1900') ),
        
        // Consolidacao
        churnRateArray = this.consolidateEntries(churnRateArray);
        mrrArray = this.consolidateEntries(mrrArray);
        
        // Ordenacao
        churnRateArray = this.orderByYearMonth(churnRateArray);
        mrrArray = this.orderByYearMonth(mrrArray);

        // Conversão Inteiro
        churnRateArray = this.convertValueToInt(churnRateArray);
        mrrArray = this.convertValueToInt(mrrArray);
        
        return {
            churnRateArr: churnRateArray,
            mrrArr: mrrArray
        }
    }
}
