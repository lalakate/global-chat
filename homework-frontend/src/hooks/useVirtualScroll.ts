import { useEffect, useMemo, useRef, useState } from 'react';
import type { Message } from '../types/types';
import type { List } from 'react-virtualized';
import { CellMeasurerCache } from 'react-virtualized';

type VirtualListProps = {
  messages: Message[];
  isInitialLoading: boolean;
};

export const useVirtualScroll = ({
  messages,
  isInitialLoading,
}: VirtualListProps) => {
  const listRef = useRef<List>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const cache = useMemo(() => {
    return new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
      minHeight: 60,
    });
  }, []);

  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [messages]);

  const initialScrollToIndex = useMemo(() => {
    if (isFirstRender && sortedMessages.length > 0) {
      return sortedMessages.length - 1;
    }
    return undefined;
  }, [isFirstRender, sortedMessages.length]);

  useEffect(() => {
    if (!isInitialLoading && sortedMessages.length > 0 && isFirstRender) {
      setIsFirstRender(false);
    }
  }, [isInitialLoading, sortedMessages.length, isFirstRender]);

  useEffect(() => {
    if (!isFirstRender && sortedMessages.length > 0 && listRef.current) {
      setTimeout(() => {
        listRef.current?.scrollToRow(sortedMessages.length - 1);
      }, 50);
    }
  }, [sortedMessages.length, isFirstRender]);

  useEffect(() => {
    if (cache && listRef.current) {
      cache.clearAll();
      listRef.current.recomputeRowHeights();
    }
  }, [sortedMessages.length, cache]);

  return {
    listRef,
    cache,
    sortedMessages,
    messagesContainerRef,
    messagesEndRef,
    initialScrollToIndex,
  };
};
