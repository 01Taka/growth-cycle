// src/components/ProblemFilters.tsx

import React from 'react';
import { IconSearch } from '@tabler/icons-react';
import { Group, Paper, Select, Stack, TextInput } from '@mantine/core';

interface ProblemFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unitFilter: string | null;
  setUnitFilter: (unit: string | null) => void;
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  uniqueUnits: string[];
  uniqueCategories: string[];
}

export const ProblemFilters: React.FC<ProblemFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  unitFilter,
  setUnitFilter,
  categoryFilter,
  setCategoryFilter,
  uniqueUnits,
  uniqueCategories,
}) => (
  <Stack gap="sm">
    <TextInput
      placeholder="検索..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      leftSection={<IconSearch size={16} />}
      radius="md"
    />

    <Group grow>
      <Select
        placeholder="ユニットで絞り込み"
        data={[
          { value: '', label: 'すべてのユニット' },
          ...uniqueUnits.map((unit) => ({ value: unit, label: unit })),
        ]}
        value={unitFilter === '' ? null : unitFilter} // nullと''を適切に扱う
        onChange={(v) => setUnitFilter(v === '' ? null : v)}
        clearable
        radius="md"
      />

      <Select
        placeholder="カテゴリーで絞り込み"
        data={[
          { value: '', label: 'すべてのカテゴリー' },
          ...uniqueCategories.map((cat) => ({ value: cat, label: cat })),
        ]}
        value={categoryFilter === '' ? null : categoryFilter} // nullと''を適切に扱う
        onChange={(v) => setCategoryFilter(v === '' ? null : v)}
        clearable
        radius="md"
      />
    </Group>
  </Stack>
);
