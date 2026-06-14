import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { ActivityCategory } from '../../models/activity-category.interface';
import type { SearchRequest, SearchResponse } from '../../types/search.types';
import type { ActivityCategoryResponse } from '../../types/activity-category.responses';
import { adaptActivityCategoriesResponse } from './adapter';

const buildQuery = (params: SearchRequest): string => {
  const usp = new URLSearchParams();
  if (params.limit !== undefined) usp.set('limit', String(params.limit));
  if (params.offset !== undefined) usp.set('offset', String(params.offset));
  if (params.search) usp.set('search', params.search);
  const query = usp.toString();
  return query ? `?${query}` : '';
};

export const searchActivityCategories = async (
  params: SearchRequest
): Promise<SearchResponse<ActivityCategory>> => {
  const raw = await doFetch<void, SearchResponse<ActivityCategoryResponse>>({
    endpoint: {
      ...endpointsPradma.searchActivityCategories,
      url: `${endpointsPradma.searchActivityCategories.url}${buildQuery(params)}`
    }
  });
  return adaptActivityCategoriesResponse(raw);
};

export const useSearchActivityCategories = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_ACTIVITY_CATEGORIES_SEARCH, params],
    queryFn: () => searchActivityCategories(params),
    placeholderData: previous => previous
  });
