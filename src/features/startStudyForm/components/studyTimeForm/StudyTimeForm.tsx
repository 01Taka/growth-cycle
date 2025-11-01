import React from 'react';
import { Stack } from '@mantine/core';
import { STUDY_TIME_BUTTON_CONFIGS } from '../../shared/constants/study-time-buttons-config';
import { StudyTimeButtonType, StudyTimeSelectButtonConfig } from '../../shared/shared-props-types';
import { useTheme } from '../../shared/useTheme';
import { StudyTimeSelectButton } from './StudyTimeSelectButton';

interface StudyTimeFormProps {
  selectedType: StudyTimeButtonType | null;
  onClick: (config: StudyTimeSelectButtonConfig, disabled: boolean) => void;
}

export const StudyTimeForm: React.FC<StudyTimeFormProps> = ({ selectedType, onClick }) => {
  const getTheme = useTheme();

  return (
    <Stack gap={8}>
      {Object.values(STUDY_TIME_BUTTON_CONFIGS).map((config) => {
        const disabled = selectedType !== null && selectedType !== config.type;
        return (
          <StudyTimeSelectButton
            key={config.type}
            {...config}
            theme={getTheme(disabled ? 'disabled' : config.themeColor)}
            disabled={disabled}
            onClick={() => onClick(config, disabled)}
          />
        );
      })}
    </Stack>
  );
};
