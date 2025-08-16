import type { Meta, StoryObj } from '@storybook/react';
import { InputField } from './input-field';

const meta: Meta<typeof InputField> = {
  title: 'UI/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    loading: { control: 'boolean' },
    showClearButton: { control: 'boolean' },
    togglePasswordVisibility: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
  },
};

export const Filled: Story = {
  args: {
    ...Default.args,
    variant: 'filled',
    label: 'Filled Input',
  },
};

export const Ghost: Story = {
  args: {
    ...Default.args,
    variant: 'ghost',
    label: 'Ghost Input',
  },
};

export const Invalid: Story = {
  args: {
    ...Default.args,
    invalid: true,
    errorMessage: 'This field is required.',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const WithClearButton: Story = {
  args: {
    ...Default.args,
    showClearButton: true,
    value: 'Some text',
  },
};

export const Password: Story = {
  args: {
    ...Default.args,
    label: 'Password',
    togglePasswordVisibility: true,
    value: 'password123',
  },
};
