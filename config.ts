// === CẤU HÌNH KẾT NỐI DỮ LIỆU LIVE (GOOGLE SHEETS) ===

/**
 * HƯỚNG DẪN CÀI ĐẶT:
 * 1. Upload file Excel danh sách thuốc của bạn lên Google Sheets.
 * 2. Trên Google Sheets, chọn menu: File (Tệp) -> Share (Chia sẻ) -> Publish to web (Xuất bản lên web).
 * 3. Trong bảng hiện ra:
 *    - Chọn "Entire Document" (Toàn bộ tài liệu) hoặc Sheet cụ thể.
 *    - Quan trọng: Chọn định dạng là "Comma-separated values (.csv)".
 * 4. Nhấn Publish (Xuất bản) và copy đường link được tạo ra.
 * 5. Dán đường link đó vào biến GOOGLE_SHEET_CSV_URL bên dưới.
 */

export const GOOGLE_SHEET_CONFIG = {
  // Dán link CSV của bạn vào giữa hai dấu ngoặc kép bên dưới.
  // Ví dụ: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRy8VfUqjIeYNfHkkkQanJnIgMmrKaZIHvH4Q2-C3LUQ7xQw71oHz8aSisLmY1kEA/pub?output=csv"
  csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRy8VfUqjIeYNfHkkkQanJnIgMmrKaZIHvH4Q2-C3LUQ7xQw71oHz8aSisLmY1kEA/pub?output=csv" 
};
