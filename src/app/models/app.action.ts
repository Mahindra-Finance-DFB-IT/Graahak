import { createAction, props } from '@ngrx/store';
import { AppData } from './app';

export const updateAppData = createAction('UPDATE_APP_DATA',props<AppData>());
