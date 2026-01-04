import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as fs from 'fs';
import pdf from 'pdf-parse';

@Injectable()
export class PdfParserService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      console.log('OpenAI API key is configured');
      this.openai = new OpenAI({ apiKey });
    }
  }

  async extractDataFromPdf(filePath: string): Promise<any> {
    try {
      // Read the PDF file
      const fileBuffer = fs.readFileSync(filePath);

      // Parse PDF and extract text
      const pdfData = await pdf(fileBuffer);
      const pdfText = pdfData.text;

      console.log('Text extracted from PDF:', pdfText);
      // const base64File = fileBuffer.toString('base64');

      if (!this.openai) {
        // Fallback: return empty structure if OpenAI is not configured
        console.error('OpenAI is not configured');
        return this.getEmptyStructure();
      }

      const prompt = `
        You are an expert at extracting structured data from German property documents (Teilungserklärung).
        document is divided into 3 sections:
          - section 1: property detail
          - section 2: buildings detail
          - section 3: units detail
        Extract the following information and return it as JSON:
          - property: Object of The name of the property, total area, area unit, internal reference number, owner
          - buildings: Array of buildings with building number, building name, street, house_number, postal_code, city, country, additional_details
          - units: Array of units with number, type (Apartment/Office/Garden/Parking), building, floor, entrance, size, co_ownership_share, 
          construction_year, rooms, description. 
        Return only valid JSON, no additional text.
        The document is:
        ${pdfText}
      `;

      // Use OpenAI API to extract information from provided text
      const response = await this.openai.responses.create({
        model: 'gpt-4.1-mini',
        input: prompt,
        temperature: 0,
      });

      console.log('Response from OpenAI:', response);

      if (!response.output_text) {
        return this.getEmptyStructure();
      }

      // Try to parse JSON from the response
      // Sometimes the response might have markdown code blocks
      let jsonString = response.output_text;
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }

      const extractedData = JSON.parse(jsonString);
      return this.normalizeExtractedData(extractedData);
    } catch (error) {
      console.error('Error extracting data from PDF:', error);
      return this.getEmptyStructure();
    }
  }

  private normalizeExtractedData(data: any): any {
    return {
      property: {
        name: data.property.name || '',
        area: data.property.total_area || '',
        area_unit: data.property.area_unit || '',
        owner: data.property.owner || '',
        internal_refrence_number: data.property.internal_reference_number || '',
        ownership_share: this.getTotalShare(data.units) || 1000,
      },
      buildings: (data.buildings || []).map((building: any) => ({
        number: building.building_number || '',
        name: building.building_name || '',
        street: building.street || '',
        house_number: building.house_number || '',
        postal_code: building.postal_code || '',
        city: building.city || '',
        country: building.country || 'Germany',
        additional_details: building.additional_details || '',
      })),
      units: (data.units || []).map((unit: any) => ({
        number: unit.number || '',
        type: this.normalizeUnitType(unit.type),
        building: unit.building || '',
        floor: unit.floor || null,
        entrance: unit.entrance || null,
        size: unit.size ? parseFloat(unit.size) : null,
        co_ownership_share: unit.co_ownership_share
          ? parseFloat(unit.co_ownership_share)
          : null,
        construction_year: unit.construction_year
          ? parseInt(unit.construction_year)
          : null,
        rooms: unit.rooms ? parseInt(unit.rooms) : null,
        description: unit.description || '',
      })),
    };
  }

  private getTotalShare(units: any[]): number {
    const share = units[0]?.co_ownership_share?.split("/");
    return share.length > 1 ? share[1] : null;
  }

  private normalizeUnitType(type: string): string {
    const normalized = type?.toLowerCase() || '';
    switch (true) {
      case normalized.includes('apartment'):
      case normalized.includes('wohnung'):
        return 'Apartment';
      case normalized.includes('office'):
      case normalized.includes('büro'):
        return 'Office';
      case normalized.includes('garden'):
      case normalized.includes('garten'):
        return 'Garden';
      case normalized.includes('parking'):
      case normalized.includes('parkplatz'):
        return 'Parking';
      default:
        return 'Apartment'; // Default
    }
  }

  private getEmptyStructure(): any {
    return {
      property_name: '',
      buildings: [],
      units: [],
    };
  }
}
