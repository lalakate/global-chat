import React from 'react';
import type { CellMeasurerCache } from 'react-virtualized';
import { List, AutoSizer, CellMeasurer } from 'react-virtualized';
import { MessageComponent } from '../Message/Message';
import type { Message } from '../../types/types';
import './virtual-list.css';

interface VirtualMessageListProps {
  messages: Message[];
  cache: CellMeasurerCache;
  listRef: React.RefObject<List>;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  initialScrollToIndex?: number;
}

export const VirtualMessageList = React.memo<VirtualMessageListProps>(
  ({
    messages,
    cache,
    listRef,
    messagesContainerRef,
    messagesEndRef,
    initialScrollToIndex,
  }) => {
    const rowRenderer = ({ index, key, parent, style }: any) => {
      const message = messages[index];

      if (!message) {
        return null;
      }

      return (
        <CellMeasurer
          key={key}
          cache={cache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          {({ registerChild }: any) => (
            <div
              ref={registerChild}
              style={style}
              className="virtual-list-item"
            >
              <MessageComponent
                message={{
                  ...message,
                  username: message.username ?? '',
                  body: message.body ?? '',
                }}
              />
              {index === messages.length - 1 && (
                <div ref={messagesEndRef} style={{ height: 1 }} />
              )}
            </div>
          )}
        </CellMeasurer>
      );
    };

    const getRowHeight = ({ index }: { index: number }) => {
      return cache.getHeight(index, 0) || 100;
    };

    return (
      <div className="virtual-list" ref={messagesContainerRef}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={listRef}
              width={width}
              height={height}
              rowCount={messages.length}
              rowHeight={getRowHeight}
              rowRenderer={rowRenderer}
              deferredMeasurementCache={cache}
              className="virtual-list-content"
              overscanRowCount={5}
              scrollToIndex={initialScrollToIndex}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
      </div>
    );
  }
);

VirtualMessageList.displayName = 'VirtualMessageList';
