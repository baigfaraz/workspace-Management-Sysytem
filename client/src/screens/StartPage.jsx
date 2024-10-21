import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Text, PrimaryButton } from '@fluentui/react';

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      tokens={{ childrenGap: 20 }}
      styles={{
        root: {
          height: '100vh',
          backgroundSize: 'cover',
        },
      }}
    >
      <Text variant="xxLarge" styles={{ root: { color: 'Black', fontWeight: 'bold' } }}>
        Team Management System
      </Text>
      <PrimaryButton
        text="Get Started"
        onClick={() => navigate("/login")}
        styles={{
          root: { padding: '12px 24px', fontSize: '16px' },
        }}
      />
    </Stack>
  );
};

export default StartPage;
