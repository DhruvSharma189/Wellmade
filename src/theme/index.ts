import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    graphite: {
      50: '#f8f6f1',
      100: '#eee9df',
      200: '#ded7ca',
      300: '#c8c0b1',
      500: '#77766d',
      700: '#34463d',
      800: '#23362e',
      900: '#15251e',
    },
    accent: {
      50: '#fdf3ef',
      100: '#fae3da',
      200: '#f5c3b0',
      300: '#ee9e83',
      400: '#e57a58',
      500: '#d47757',
      600: '#bd5e40',
      700: '#9d4a30',
      800: '#7e3c27',
      900: '#643222',
    },
    olive: {
      500: '#8b9270',
      600: '#727a59',
    },
  },
  fonts: {
    heading: "'Manrope', 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    body: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: '#f8f6f1',
        color: '#1a2922',
      },
      '::selection': {
        bg: '#f0c7b8',
        color: '#15251e',
      },
      'a, button': {
        WebkitTapHighlightColor: 'transparent',
      },
    },
  },
  radii: {
    xl: '14px',
    '2xl': '20px',
    '3xl': '26px',
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'gray',
      },
      baseStyle: {
        fontWeight: 650,
        borderRadius: '12px',
        transition: 'all .18s ease',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'accent.500',
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: 'accent.500',
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: 'accent.500',
      },
    },
  },
});
