import { memo, useCallback } from 'react';
import { CandidateBrowseCard } from '@/features/employer/presentation/components/CandidateBrowseCard';

type Props = {
  item: Record<string, unknown>;
  onOpen: (candidateId: string) => void;
};

export const BrowseListRow = memo(function BrowseListRow({ item, onOpen }: Props) {
  const candidateId = String(item.id);
  const handlePress = useCallback(() => onOpen(candidateId), [candidateId, onOpen]);
  return <CandidateBrowseCard item={item} onPress={handlePress} />;
});
