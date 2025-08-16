import React from 'react';
import { render, screen } from '@testing-library/react';
import { InputField } from './input-field';

describe('InputField', () => {
  it('renders the input field with a label', () => {
    render(<InputField label="Test Label" />);
    const labelElement = screen.getByText(/Test Label/i);
    expect(labelElement).toBeInTheDocument();
  });

  it('renders a disabled input', () => {
    render(<InputField label="Test Label" disabled />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeDisabled();
  });

  it('renders an invalid input with an error message', () => {
    render(<InputField label="Test Label" invalid errorMessage="This is an error" />);
    const inputElement = screen.getByRole('textbox');
    const errorMessage = screen.getByText('This is an error');
    expect(inputElement).toHaveAttribute('aria-invalid', 'true');
    expect(errorMessage).toBeInTheDocument();
  });

  it('shows a clear button when showClearButton is true and there is a value', () => {
    render(<InputField label="Test Label" value="Some text" showClearButton />);
    const clearButton = screen.getByRole('button', { name: /Clear input/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(<InputField label="Password" type="password" togglePasswordVisibility />);
    const passwordToggle = screen.getByRole('button', { name: /Show password/i });
    expect(passwordToggle).toBeInTheDocument();
  });
});
