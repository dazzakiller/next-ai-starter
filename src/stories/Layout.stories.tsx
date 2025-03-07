import type { Meta, StoryObj } from '@storybook/react';
import { Layout } from '@/components/ui/Layout';

const meta: Meta<typeof Layout> = {
  title: 'Components/Layout',
  component: Layout,
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
    showFullFooter: {
      control: 'boolean',
      description: 'Whether to show the full footer with all sections',
    },
    showNavBar: {
      control: 'boolean',
      description: 'Whether to show the navigation bar',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultLayout: Story = {
  args: {
    isLoggedIn: false,
    showFullFooter: true,
    showNavBar: true,
    children: (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Main Content Area
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            This is the main content area of the layout. In a real application, this would contain
            the specific page content.
          </p>
        </div>
      </div>
    ),
  },
};

export const LoggedInUser: Story = {
  args: {
    isLoggedIn: true,
    userName: 'Jane Doe',
    unreadNotifications: 3,
    showFullFooter: true,
    showNavBar: true,
    children: (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            User Dashboard
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            This is a sample user dashboard for Jane Doe. It would show personalized content and options.
          </p>
        </div>
      </div>
    ),
  },
};

export const MinimalLayout: Story = {
  args: {
    isLoggedIn: false,
    showFullFooter: false,
    showNavBar: true,
    children: (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Minimal Layout Example
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            This example uses a minimal footer for a cleaner look.
          </p>
        </div>
      </div>
    ),
  },
};

export const NoNavBar: Story = {
  args: {
    isLoggedIn: false,
    showFullFooter: true,
    showNavBar: false,
    children: (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Navigation Bar
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            This example doesn't display a navigation bar, which might be useful for landing pages or
            special promotional pages.
          </p>
        </div>
      </div>
    ),
  },
};