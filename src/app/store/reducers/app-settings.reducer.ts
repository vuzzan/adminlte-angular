import * as SettingsActions from '../actions/app-settings.actions';
import { AppSettings } from '../../interfaces/settings';
import { environment } from '../../../environments/environment';

export type Action = SettingsActions.All;

// Default app state
const defaultSettings: AppSettings = environment.appSettings;

// Helper function to create new state object
const newState = (state, newData) => {
  return Object.assign({}, state, newData);
}

// Reducer function
export function appSettingsReducer(state: AppSettings = defaultSettings, action: Action) {
  switch (action.type) {
    case SettingsActions.SET: {
      return action.data;
    }
    case SettingsActions.UPDATE: {
      return newState(state, action.data);
    }
    case SettingsActions.RESET: {
      return state = defaultSettings;
    }
    case SettingsActions.SIDEBAR_STATE: {
      return {
        ...state,
        sidebarOpened: action.data
      };
    }
    default: {
      return state;
    }
  }
}
