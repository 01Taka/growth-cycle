// src/hooks/useProblemFiltering.ts

import { useMemo, useState } from 'react';
import { ExpandedLearningCycleProblem } from '@/features/app/learningCycles/types/expand-learning-cycle-types';

// カスタムフックの引数と返り値の型
interface UseProblemFilteringProps {
  problems: ExpandedLearningCycleProblem[];
}

interface UseProblemFilteringResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unitFilter: string | null;
  setUnitFilter: (unit: string | null) => void;
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  uniqueUnits: string[];
  uniqueCategories: string[];
  filteredProblems: ExpandedLearningCycleProblem[];
}

export const useProblemFiltering = ({
  problems,
}: UseProblemFilteringProps): UseProblemFilteringResult => {
  const [searchQuery, setSearchQuery] = useState('');
  const [unitFilter, setUnitFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // ユニークなユニットとカテゴリーを取得 (problemsが変わるまでメモ化)
  const { uniqueUnits, uniqueCategories } = useMemo(() => {
    const units = Array.from(new Set(problems.map((p) => p.unitName)));
    const categories = Array.from(new Set(problems.map((p) => p.categoryName)));
    return { uniqueUnits: units, uniqueCategories: categories };
  }, [problems]);
  const filteredProblems = useMemo(() => {
    // 1. フィルタリング
    const filtered = problems.filter((problem) => {
      const lowerSearchQuery = searchQuery.toLowerCase();

      const matchesSearch =
        problem.unitName.toLowerCase().includes(lowerSearchQuery) ||
        problem.categoryName.toLowerCase().includes(lowerSearchQuery) ||
        problem.problemNumber.toString().includes(searchQuery);

      const matchesUnit = !unitFilter || problem.unitName === unitFilter;
      const matchesCategory = !categoryFilter || problem.categoryName === categoryFilter;

      return matchesSearch && matchesUnit && matchesCategory;
    });

    // 2. ソート: problemIndexを最優先でソート
    // problemIndexはnumber型を想定
    return filtered.sort((a, b) => a.problemIndex - b.problemIndex);
  }, [problems, searchQuery, unitFilter, categoryFilter]);

  return {
    searchQuery,
    setSearchQuery,
    unitFilter,
    setUnitFilter,
    categoryFilter,
    setCategoryFilter,
    uniqueUnits,
    uniqueCategories,
    filteredProblems,
  };
};
