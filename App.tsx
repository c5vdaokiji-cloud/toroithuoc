import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import DataTable from './components/DataTable';
import DataGrid from './components/DataGrid';
import StatsOverview from './components/StatsOverview';
import SearchBar from './components/SearchBar';
import DetailModal from './components/DetailModal';
import Pagination from './components/Pagination';
import AdminLoginModal from './components/AdminLoginModal';
import LandingPage from './components/LandingPage';
import BackgroundEffect from './components/BackgroundEffect'; 
import AdminDashboard from './components/AdminDashboard'; 
import { TradeItem, SortConfig, SortField, SearchConfig } from './types';
import { parseExcelFile, exportToExcel, loadDataFromUrl, exportToJsonFile, fetchGoogleSheetData } from './services/excelService';
import { dbService } from './services/dbService';
import { ToastProvider, useToast } from './components/Toast';
import { triggerConfetti } from './utils/confetti';
import { GOOGLE_SHEET_CONFIG } from './config';

const MainApp: React.FC = () => {
  // Navigation State
  const [showLanding, setShowLanding] = useState(true);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false); 

  const [items, setItems] = useState<TradeItem[]>([]);
  const [search, setSearch] = useState('');
  
  // Auth State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  
  // Progress State
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');

  // Toast Hook
  const { addToast } = useToast();

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState<TradeItem | null>(null);
  
  // Sorting State
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: null,
    direction: 'asc'
  });

  // Advanced Search State
  const [searchConfig, setSearchConfig] = useState<SearchConfig>({
    field: 'all',
    matchType: 'contains',
    showFavoritesOnly: false
  });

  // Force Title Update
  useEffect(() => {
    document.title = "MediSearch - Tra Cứu Dược Phẩm 4.0";
  }, []);

  // --- Initial Data Load (Priority: Google Sheets -> data.json -> Local DB) ---
  useEffect(() => {
    const initializeData = async () => {
      let finalItems: TradeItem[] = [];
      let source = 'local';
      
      try {
        // 1. Check Google Sheets Config First (Highest Priority)
        if (GOOGLE_SHEET_CONFIG.csvUrl && GOOGLE_SHEET_CONFIG.csvUrl.startsWith('http')) {
           try {
             const sheetItems = await fetchGoogleSheetData(GOOGLE_SHEET_CONFIG.csvUrl);
             if (sheetItems.length > 0) {
                finalItems = sheetItems;
                source = 'google_sheet';
                console.log("Loaded data from Google Sheets");
             }
           } catch (sheetErr) {
             console.error("Failed to load Google Sheet:", sheetErr);
             addToast('Không thể kết nối Google Sheets, đang dùng dữ liệu offline.', 'error');
           }
        }

        // 2. If no sheet data, try data.json
        if (finalItems.length === 0) {
            try {
                const remoteItems = await loadDataFromUrl('/data.json');
                if (remoteItems.length > 0) {
                    finalItems = remoteItems;
                    source = 'remote_json';
                }
            } catch (jsonErr) {
                console.warn("No data.json found");
            }
        }
        
        // 3. Merge with Local Favorites (Always preserve favorites)
        const localItems = await dbService.getItems() || [];
        
        if (finalItems.length > 0) {
           // Merge isFavorite from local to remote data
           finalItems = finalItems.map(rItem => {
              const localMatch = localItems.find(l => 
                String(l.stt) === String(rItem.stt) && l.name === rItem.name
              );
              return localMatch ? { ...rItem, isFavorite: localMatch.isFavorite } : rItem;
           });
           
           // Update local DB cache
           await dbService.saveItems(finalItems);
        } else {
           // Fallback to local DB if everything else fails
           finalItems = localItems;
        }

        if (finalItems.length > 0) {
          setItems(finalItems);
          if (source === 'google_sheet') {
              addToast(`Đã đồng bộ ${finalItems.length} mục từ Google Sheets`, 'success');
          }
        }
      } catch (err) {
        console.error("Critical Data Load Error", err);
      }
    };
    initializeData();
  }, [addToast]);

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchConfig, sortConfig, items]);

  // Unified Admin Request Handler
  const handleOpenAdminDashboard = () => {
    if (isAdmin) {
      setShowAdminDashboard(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setShowAdminDashboard(true);
    addToast('Đăng nhập quản trị thành công', 'success');
  };

  const handleResetDatabase = async () => {
      try {
        await dbService.clearItems();
        setItems([]);
        addToast('Đã xóa toàn bộ dữ liệu hệ thống', 'success');
      } catch (e) {
        addToast('Lỗi khi xóa dữ liệu', 'error');
      }
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);
    setUploadStatus('Đang khởi tạo...');

    try {
      let newItems: TradeItem[] = [];

      setUploadStatus('Đang đọc file Excel...');
      setUploadProgress(20);
      
      await new Promise(r => setTimeout(r, 300));
      setUploadStatus('Đang phân tích cấu trúc bảng...');
      setUploadProgress(50);
      
      newItems = await parseExcelFile(file);
      
      setUploadStatus('Đang lưu dữ liệu...');
      await dbService.saveItems(newItems);
      
      setUploadStatus('Hoàn tất!');
      setUploadProgress(100);
      
      await new Promise(r => setTimeout(r, 800));

      setItems(newItems); 
      addToast(`Đã tải lên thành công ${newItems.length} mục`, 'success');
      triggerConfetti(); // FIRE CELEBRATION!
      setShowLanding(false); // Go to main app if on landing
    } catch (error) {
      addToast("Lỗi xử lý file: " + (error as Error).message, 'error');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
      setUploadStatus('');
    }
  };

  // --- Inline Update Logic ---
  const handleUpdateItem = async (originalItem: TradeItem, updatedItem: TradeItem) => {
    try {
      const newItems = items.map(item => {
         if (item === originalItem) return updatedItem;
         if (item.stt === originalItem.stt && item.name === originalItem.name && item.link === originalItem.link) {
             return updatedItem;
         }
         return item;
      });

      setItems(newItems);
      await dbService.saveItems(newItems);
      addToast('Đã cập nhật thông tin', 'success');
    } catch (error) {
      console.error("Update failed", error);
      addToast('Cập nhật thất bại', 'error');
    }
  };

  const handleToggleFavorite = async (itemToToggle: TradeItem) => {
    const updatedItems = items.map(item => {
      if (item.stt === itemToToggle.stt && item.name === itemToToggle.name) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    });
    setItems(updatedItems);
    await dbService.saveItems(updatedItems);

    const isFav = !itemToToggle.isFavorite;
    addToast(isFav ? 'Đã thêm vào mục quan tâm' : 'Đã bỏ khỏi mục quan tâm', 'info');

    if (selectedItem && selectedItem.stt === itemToToggle.stt && selectedItem.name === itemToToggle.name) {
        setSelectedItem({ ...selectedItem, isFavorite: !selectedItem.isFavorite });
    }
  };

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: 
        current.field === field && current.direction === 'asc' 
          ? 'desc' 
          : 'asc',
    }));
  };

  const suggestionList = useMemo(() => {
    const names = new Set(items.map(i => i.name).filter(Boolean));
    return Array.from(names);
  }, [items]);

  const processedItems = useMemo(() => {
    let result = [...items];

    if (searchConfig.showFavoritesOnly) {
        result = result.filter(item => item.isFavorite);
    }
    
    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      const isExact = searchConfig.matchType === 'exact';
      
      result = result.filter(item => {
        const nameVal = item.name.toLowerCase();
        const sttVal = String(item.stt).toLowerCase();
        const checkMatch = (val: string) => isExact ? val === searchTerm : val.includes(searchTerm);

        if (searchConfig.field === 'name') return checkMatch(nameVal);
        else if (searchConfig.field === 'stt') return checkMatch(sttVal);
        else return checkMatch(nameVal) || checkMatch(sttVal);
      });
    }

    if (sortConfig.field) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.field!];
        const bValue = b[sortConfig.field!];
        const compareResult = String(aValue).localeCompare(String(bValue), undefined, { numeric: true, sensitivity: 'base' });
        return sortConfig.direction === 'asc' ? compareResult : -compareResult;
      });
    }

    return result;
  }, [items, search, sortConfig, searchConfig]);

  const handleExport = () => {
    if (processedItems.length === 0) {
      addToast("Không có dữ liệu để xuất.", 'error');
      return;
    }
    const success = exportToExcel(processedItems, `MediSearch_Export_${new Date().toISOString().slice(0,10)}.xlsx`);
    if(success) addToast('Đã xuất file Excel thành công', 'success');
    else addToast('Lỗi khi xuất file', 'error');
  };

  const handleExportDeployJson = () => {
     const success = exportToJsonFile(items, 'data.json');
     if (success) {
        addToast('Đã xuất file data.json! Hãy đặt file này vào thư mục public.', 'success');
     } else {
        addToast('Lỗi khi xuất file JSON.', 'error');
     }
  }

  const paginatedItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return processedItems.slice(indexOfFirstItem, indexOfLastItem);
  }, [processedItems, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      <BackgroundEffect isDarkMode={isDarkMode} />

      <AdminDashboard 
        isOpen={showAdminDashboard}
        onClose={() => setShowAdminDashboard(false)}
        onUpload={handleFileUpload}
        onResetDatabase={handleResetDatabase}
        onExportDeployJson={handleExportDeployJson}
        isProcessing={isProcessing}
        progress={uploadProgress}
        status={uploadStatus}
        itemCount={items.length}
      />

      {showLanding ? (
        <>
          <LandingPage onStart={() => setShowLanding(false)} />
          <button
             onClick={toggleTheme}
             className="fixed bottom-6 right-6 p-3 bg-white/10 backdrop-blur-md border border-slate-200/20 rounded-full text-slate-500 dark:text-slate-400 hover:bg-white/20 transition-all z-50"
          >
               {isDarkMode ? "🌙" : "☀️"}
          </button>
        </>
      ) : (
        <>
          <Header 
            onOpenAdmin={handleOpenAdminDashboard}
            onGoHome={() => setShowLanding(true)}
            onExport={handleExport}
            itemCount={items.length} 
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />

          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-400 dark:to-blue-400">Tra Cứu Dược Phẩm</span> Thông Minh
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto backdrop-blur-sm">
                Hệ thống dữ liệu số hóa hỗ trợ tra cứu văn bản gốc và liên kết thương mại.
              </p>
            </div>

            <StatsOverview items={items} />

            <SearchBar 
              value={search} 
              onChange={setSearch} 
              config={searchConfig}
              onConfigChange={setSearchConfig}
              suggestions={suggestionList}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
            
            {viewMode === 'list' ? (
                <DataTable 
                  data={paginatedItems} 
                  isLoading={isProcessing}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  onRowClick={setSelectedItem}
                  onToggleFavorite={handleToggleFavorite}
                  onUpdateItem={isAdmin ? handleUpdateItem : undefined}
                />
            ) : (
                <DataGrid 
                  data={paginatedItems} 
                  isLoading={isProcessing}
                  onRowClick={setSelectedItem}
                  onToggleFavorite={handleToggleFavorite}
                />
            )}

            <Pagination 
              currentPage={currentPage}
              totalItems={processedItems.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(n) => {
                setItemsPerPage(n);
                setCurrentPage(1); 
              }}
            />

          </main>

          <AdminLoginModal 
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={handleAdminLoginSuccess}
          />

          <DetailModal 
            item={selectedItem}
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            onToggleFavorite={handleToggleFavorite}
          />

          <footer className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 mt-auto py-8 transition-colors duration-300 relative z-10">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
                 Hệ thống hỗ trợ tra cứu nội bộ
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-xs">
                &copy; {new Date().getFullYear()} MediSearch. Powered by React.
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
};

export default App;