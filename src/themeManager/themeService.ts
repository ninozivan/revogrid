import { ThemeSpace } from '../interfaces';
import ThemeCompact from './theme.compact';
import ThemeDefault from './theme.default';
import ThemeMaterial from './theme.material';
import ThemeCustomProperties from './theme.custom-properties';

export const DEFAULT_THEME = 'default';
export const allowedThemes: ThemeSpace.Theme[] = [DEFAULT_THEME, 'material', 'compact', 'darkMaterial', 'darkCompact', 'customProperties'];
export default class ThemeService {
  private currentTheme: ThemeSpace.ThemePackage;
  private customRowSize: number = 0;

  get theme() {
    return this.currentTheme;
  }

  get rowSize(): number {
    return this.customRowSize || this.currentTheme.defaultRowSize;
  }

  set rowSize(size: number) {
    this.customRowSize = size;
  }

  constructor(cfg: ThemeSpace.ThemeConfig) {
    this.customRowSize = this.getCustomRowSize(cfg);
    this.register('default');
  }

  getCustomRowSize(cfg: ThemeSpace.ThemeConfig) {
    const revoGridEl = document.querySelector('revo-grid[theme="customProperties"]');

    if (!revoGridEl) {
      return cfg.rowSize;
    }

    const defaultRowSizeCssCustomProperty: string = getComputedStyle(revoGridEl).getPropertyValue('--rg-default-row-size');

    if (defaultRowSizeCssCustomProperty) {
      return Number(defaultRowSizeCssCustomProperty.replace('px', '')) ?? this.currentTheme.defaultRowSize;
    } else {
      return cfg.rowSize;
    }
  }

  register(theme: ThemeSpace.Theme) {
    const parsedTheme = ThemeService.getTheme(theme);
    switch (parsedTheme) {
      case 'material':
      case 'darkMaterial':
        this.currentTheme = new ThemeMaterial();
        break;
      case 'compact':
      case 'darkCompact':
        this.currentTheme = new ThemeCompact();
        break;
      case 'customProperties':
        this.currentTheme = new ThemeCustomProperties();
        break;
      default:
        this.currentTheme = new ThemeDefault();
        break;
    }
  }

  static getTheme(theme: string): ThemeSpace.Theme {
    if (allowedThemes.indexOf(theme as ThemeSpace.Theme) > -1) {
      return theme as ThemeSpace.Theme;
    }
    return DEFAULT_THEME;
  }
}
