/**
 * Wrapper genérico de respuesta paginada de la API. Coincide 1:1 con el shape
 * que devuelve el backend (`{ data, total_rows, offset, limit }`).
 */
export interface PaginatedResponse<T> {
  data: T[];
  total_rows: number;
  offset: number;
  limit: number;
}
