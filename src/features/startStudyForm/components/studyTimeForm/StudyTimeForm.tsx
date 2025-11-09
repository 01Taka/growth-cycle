import React from 'react';
import { Box, Stack } from '@mantine/core';
import { STUDY_TIME_BUTTON_CONFIGS } from '../../shared/components-constants/study-time-buttons-config';
import {
  StudyTimeButtonType,
  StudyTimeSelectButtonConfig,
} from '../../shared/components-types/shared-props-types';
import { useStudyFormTheme } from '../../shared/useStudyFormTheme';
import { StudyTimeSelectButton } from './StudyTimeSelectButton';

interface StudyTimeFormProps {
  selectedType: StudyTimeButtonType | null;
  onClick: (config: StudyTimeSelectButtonConfig, disabled: boolean) => void;
}

export const StudyTimeForm: React.FC<StudyTimeFormProps> = ({ selectedType, onClick }) => {
  const getTheme = useStudyFormTheme();

  return (
    <Stack gap={8}>
      {Object.values(STUDY_TIME_BUTTON_CONFIGS).map((config) => {
        const disabled = selectedType !== null && selectedType !== config.type;
        return (
          <Box key={config.type} style={{ marginBottom: config.type === 'instant' ? 20 : 0 }}>
            <StudyTimeSelectButton
              {...config}
              theme={getTheme(disabled ? 'disabled' : config.themeColor)}
              disabled={disabled}
              onClick={() => onClick(config, disabled)}
            />
          </Box>
        );
      })}
    </Stack>
  );
};
