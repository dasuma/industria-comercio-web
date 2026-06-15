import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { ActivityCategory } from '../../models/activity-category.interface';
import type { SearchRequest, SearchResponse, ApiSearchResponse } from '../../types/search.types';
import type { ActivityCategoryResponse } from '../../types/activity-category.responses';
import { adaptActivityCategoriesResponse } from './adapter';

export const searchActivityCategories = async (
  params: SearchRequest
): Promise<SearchResponse<ActivityCategory>> => {
  const raw = await doFetch<SearchRequest, ApiSearchResponse<ActivityCategoryResponse>>({
    endpoint: endpointsPradma.searchActivityCategories,
    params
  });
  return adaptActivityCategoriesResponse(raw);
};

export const useSearchActivityCategories = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_ACTIVITY_CATEGORIES_SEARCH, params],
    queryFn: () => searchActivityCategories(params),
    placeholderData: previous => previous
  });
