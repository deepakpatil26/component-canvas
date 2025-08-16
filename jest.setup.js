import '@testing-library/jest-dom';
// Mock for next/font
jest.mock('next/font/google', () => ({
  Inter: () => ({
    style: {
      fontFamily: 'mocked',
    },
  }),
}));

// Mock for next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: jest.fn(),
    themes: ['light', 'dark'],
    theme: 'light',
  }),
  ThemeProvider: ({ children }) => (
    <div>{children}</div>
  )
}));
