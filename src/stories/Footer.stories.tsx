import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from '@/components/ui/Footer';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    showFullFooter: {
      control: 'boolean',
      description: 'Whether to show the full footer with all sections',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FullFooter: Story = {
  args: {
    showFullFooter: true,
  },
};

export const MinimalFooter: Story = {
  args: {
    showFullFooter: false,
  },
};