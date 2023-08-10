export const GENERATE_FAVOURITE = 'directReservation/GENERATE_FAVOURITE';
export const FAVOURITE_GENERATED = 'directReservation/FAVOURITE_GENERATED';
export const FAVOURITE_GENERATION_FAILED =
  'directReservation/FAVOURITE_GENERATION_FAILED';

export interface GenerateFavouriteAction {
  type: typeof GENERATE_FAVOURITE;
  payload: string;
}

export interface FavouriteGeneratedAction {
  type: typeof FAVOURITE_GENERATED;
}

export interface FavouriteGenerationFailedAction {
  type: typeof FAVOURITE_GENERATION_FAILED;
}
