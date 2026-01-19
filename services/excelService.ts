import * as XLSX from 'xlsx';
import { TradeItem } from '../types';

export const parseExcelFile = async (file: File): Promise<TradeItem[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error("Không thể đọc dữ liệu file"));
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0]; // Assume data is in the first sheet
        const sheet = workbook.Sheets[sheetName];
        
        // Convert to JSON with headers
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        if (jsonData.length < 2) {
            resolve([]); // Empty or just header
            return;
        }

        // Simple heuristic to find columns. 
        // We look for "STT", "Tên", "Link" or assume columns 0, 1, 2 if headers aren't clear.
        // For robustness, let's look at the first row (header row)
        const headerRow = jsonData[0].map((h: any) => String(h).toLowerCase());
        
        let sttIdx = headerRow.findIndex((h: string) => h.includes('stt'));
        let nameIdx = headerRow.findIndex((h: string) => h.includes('tên') || h.includes('name'));
        let linkIdx = headerRow.findIndex((h: string) => h.includes('link') || h.includes('url') || h.includes('web'));

        // Fallback indices if headers not found
        if (sttIdx === -1) sttIdx = 0;
        if (nameIdx === -1) nameIdx = 1;
        if (linkIdx === -1) linkIdx = 2;

        const items: TradeItem[] = [];

        // Iterate from row 1 (skipping header)
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          // Check if row has data in the name column at least
          if (row[nameIdx]) {
              items.push({
                  stt: row[sttIdx] || i,
                  name: String(row[nameIdx]),
                  link: row[linkIdx] ? String(row[linkIdx]) : '#'
              });
          }
        }

        resolve(items);
      } catch (error) {
        console.error("Excel Parsing Error:", error);
        reject(new Error("Không thể phân tích file Excel. Đảm bảo file có các cột STT, Tên và Link."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Lỗi đọc file"));
    };

    reader.readAsBinaryString(file);
  });
};

export const exportToExcel = (data: TradeItem[], fileName: string = 'Ket_qua_tra_cuu.xlsx') => {
    try {
        // Map data to simpler format for export
        const exportData = data.map(item => ({
            "STT": item.stt,
            "Tên Thương Mại": item.name,
            "Liên Kết": item.link,
            "Yêu Thích": item.isFavorite ? "Có" : "Không",
            "Cập Nhật": item.lastUpdated || ""
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        
        // Auto-width columns
        const wscols = [
            { wch: 10 }, // STT
            { wch: 40 }, // Name
            { wch: 50 }, // Link
            { wch: 10 }, // Favorite
            { wch: 15 }  // Date
        ];
        worksheet['!cols'] = wscols;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

        XLSX.writeFile(workbook, fileName);
        return true;
    } catch (error) {
        console.error("Export Error:", error);
        return false;
    }
};

/**
 * Downloads the current dataset as a JSON file.
 * This is used by the Admin to generate the 'data.json' for deployment.
 */
export const exportToJsonFile = (data: TradeItem[], fileName: string = 'data.json') => {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return true;
    } catch (error) {
        console.error("JSON Export Error:", error);
        return false;
    }
};

/**
 * Fetches the static data.json file from the server (public folder).
 */
export const loadDataFromUrl = async (url: string): Promise<TradeItem[]> => {
    try {
        const response = await fetch(url, { cache: "no-store" }); // Avoid caching to get fresh data
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
            return data as TradeItem[];
        }
        return [];
    } catch (error) {
        console.warn("Could not load remote data:", error);
        // Return empty array to indicate failure to load remote data, 
        // calling code should decide whether to fallback to local DB.
        return [];
    }
};