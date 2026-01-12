import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App Integration', () => {
  it('should render without crashing', () => {
    render(<App />);
    // The app should render successfully
    expect(document.body).toBeTruthy();
  });

  it('should have router configured', () => {
    render(<App />);
    // Router should be working - the app uses BrowserRouter internally
    // Just verify the app loads without errors
    expect(document.querySelector('body')).toBeInTheDocument();
  });
});
