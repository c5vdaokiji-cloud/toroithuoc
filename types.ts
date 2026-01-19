export interface HistoryEvent {
  date: string;
  action: string;
  user: string;
  detail?: string;
}

export interface TradeItem {
  stt: string | number;
  name: string;
  link: string;
  lastUpdated?: string;
  history?: HistoryEvent[];
  isFavorite?: boolean;
  imageUrl?: string;
}

export interface FileProcessingResult {
  success: boolean;
  data: TradeItem[];
  error?: string;
}

export type SortField = 'stt' | 'name';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: SortField | null;
  direction: SortOrder;
}

export type FilterField = 'all' | 'name' | 'stt';
export type MatchType = 'contains' | 'exact';

export interface SearchConfig {
  field: FilterField;
  matchType: MatchType;
  showFavoritesOnly?: boolean;
}