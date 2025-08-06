import 'styled-components';
import { AppTheme } from './theme/themes';

declare module 'styled-components' {
  export interface DefaultTheme {
    // если используешь темы — добавь сюда
  }

  // Расширяем HTML-элементы, чтобы разрешить data-* атрибуты
  export interface BaseProps<T extends keyof JSX.IntrinsicElements> extends React.HTMLAttributes<HTMLElementTagNameMap[T]> {
    'data-component'?: string;
  }

  // Расширяем тему
  export interface DefaultTheme extends AppTheme {}
}