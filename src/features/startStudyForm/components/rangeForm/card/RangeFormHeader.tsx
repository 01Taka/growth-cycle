import React from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { ActionIcon, Box, Collapse, ComboboxItem, Divider, Flex, Stack, Text } from '@mantine/core';
import { CustomCreatableSelect } from '@/shared/components/CustomCreatableSelect';
import { TEXT_CONTENT } from '../../../shared/range/range-form-config';
import { RangeTextForm } from '../../../shared/range/range-form-types';

// Props型定義
interface RangeFormHeaderProps {
  unitForm: RangeTextForm; // 適切な型に置き換えてください
  categoryForm: RangeTextForm; // 適切な型に置き換えてください
  unitHandler: {
    data: ComboboxItem[] | string[];
    onCreate: (query: string) => void;
  };
  categoryHandler: {
    data: ComboboxItem[] | string[];
    onCreate: (query: string) => void;
  };
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const RangeFormHeader: React.FC<RangeFormHeaderProps> = ({
  unitForm,
  categoryForm,
  unitHandler,
  categoryHandler,
  isCollapsed,
  onToggleCollapse,
}) => (
  <Stack gap="sm">
    <Flex justify="space-between" gap="lg">
      <Box w={'100%'}>
        <Collapse in={!isCollapsed}>
          <Stack gap="xs">
            <CustomCreatableSelect
              label={TEXT_CONTENT.UNIT_SELECT_LABEL}
              {...unitForm}
              {...unitHandler}
            />
            <CustomCreatableSelect
              label={TEXT_CONTENT.CATEGORY_SELECT_LABEL}
              {...categoryForm}
              {...categoryHandler}
            />
          </Stack>
        </Collapse>

        {isCollapsed && (
          <Stack gap="xs">
            <Flex gap="xs" wrap="wrap" align="center">
              <Text size="md" fw={500}>
                {TEXT_CONTENT.SUMMARY_UNIT_TITLE}
              </Text>
              <Text size="lg" fw={700}>
                {unitForm.value}
              </Text>
            </Flex>

            <Flex gap="xs" wrap="wrap" align="center">
              <Text size="md" fw={500}>
                {TEXT_CONTENT.SUMMARY_CATEGORY_TITLE}
              </Text>
              <Text size="lg" fw={700}>
                {categoryForm.value}
              </Text>
            </Flex>
          </Stack>
        )}
      </Box>
      <ActionIcon
        mt={5}
        variant="default"
        onClick={onToggleCollapse}
        size="lg"
        aria-label={
          isCollapsed
            ? TEXT_CONTENT.COLLAPSE_BUTTON_ARIA_OPEN
            : TEXT_CONTENT.COLLAPSE_BUTTON_ARIA_CLOSE
        }
      >
        {isCollapsed ? <IconChevronDown size={20} /> : <IconChevronUp size={20} />}
      </ActionIcon>
    </Flex>
    <Divider />
  </Stack>
);
