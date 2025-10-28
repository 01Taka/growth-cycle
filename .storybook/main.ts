import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  core: {
    disableWhatsNewNotifications: true,
    disableTelemetry: true,
    enableCrashReports: false,
  },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'], // '../src/**/*.mdx',
  addons: ['@storybook/addon-themes', '@storybook/addon-onboarding', 'storybook-addon-mantine'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
