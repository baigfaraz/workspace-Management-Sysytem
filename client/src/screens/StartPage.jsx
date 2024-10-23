import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stack, 
  Text, 
  PrimaryButton, 
  DefaultButton,
  initializeIcons
} from '@fluentui/react';
import { mergeStyles } from '@fluentui/merge-styles';

// Initialize Fluent UI icons
initializeIcons();

// Merge Fluent UI styles with Tailwind classes
const containerClass = mergeStyles('min-h-screen flex flex-col');
const headerClass = mergeStyles('p-4 flex items-center bg-gray-100');
const mainClass = mergeStyles('flex-1 flex items-center justify-center text-center bg-gray-50');
const contentClass = mergeStyles('max-w-2xl px-4');
const buttonContainerClass = mergeStyles('flex justify-center gap-4 mt-8');
const footerClass = mergeStyles('p-4 text-center text-sm text-gray-600 bg-gray-100');

function StartPage() {
  const navigate = useNavigate();

  return (
    <Stack className={containerClass}>
      <Stack className={headerClass}>
        <Text variant="xLarge" className="font-bold">Team Management System</Text>
      </Stack>
      <Stack className={mainClass}>
        <Stack className={contentClass}>
          <Text variant="xxLarge" className="font-bold mb-4">Welcome to Team Management</Text>
          <Text variant="large" className="text-gray-600 mb-8">
            Streamline your team's workflow and boost productivity with our easy-to-use platform.
          </Text>
          <Stack horizontal className={buttonContainerClass}>
            <PrimaryButton 
              text="Get Started" 
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-base"
            />
            <DefaultButton 
              text="Sign Up" 
              onClick={() => navigate('/register')}
              className="px-6 py-2 text-base border-blue-600 text-blue-600 hover:bg-blue-50"
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack className={footerClass}>
        <Text>© {new Date().getFullYear()} Team Management System. All rights reserved.</Text>
      </Stack>
    </Stack>
  );
}

export default StartPage;