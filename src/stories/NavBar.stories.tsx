import type { Meta, StoryObj } from '@storybook/react';
import { NavBar } from '@/components/ui/NavBar';

const meta: Meta<typeof NavBar> = {
  title: 'Components/NavBar',
  component: NavBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isLoggedIn: {
      control: 'boolean',
      description: 'Whether the user is logged in',
    },
    userName: {
      control: 'text',
      description: 'The name of the logged-in user',
    },
    unreadNotifications: {
      control: { type: 'number', min: 0 },
      description: 'Number of unread notifications',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default state - Logged out
export const LoggedOut: Story = {
  args: {
    isLoggedIn: false,
  },
};

// Logged in state
export const LoggedIn: Story = {
  args: {
    isLoggedIn: true,
    userName: 'Jane Doe',
    unreadNotifications: 0,
  },
};

// Logged in with notifications
export const WithNotifications: Story = {
  args: {
    isLoggedIn: true,
    userName: 'John Smith',
    unreadNotifications: 5,
  },
};

// Logged in with many notifications
export const WithManyNotifications: Story = {
  args: {
    isLoggedIn: true,
    userName: 'Alice Johnson',
    unreadNotifications: 12,
  },
};

// Long user name
export const LongUserName: Story = {
  args: {
    isLoggedIn: true,
    userName: 'Alexandra Rodriguez-Williamson',
    unreadNotifications: 3,
  },
};

// Mobile view (adjust viewport in parameters)
export const MobileView: Story = {
  args: {
    isLoggedIn: true,
    userName: 'Mobile User',
    unreadNotifications: 2,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};