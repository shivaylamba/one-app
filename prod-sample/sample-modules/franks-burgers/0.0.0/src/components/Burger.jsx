/*
 * Copyright 2020 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';

const grid = 8;

export default function Burger() {
  const [items, setItems] = React.useState([
    <FormattedMessage id="franks-burger-bun" />,
    <FormattedMessage id="franks-burger" />,
    <FormattedMessage id="franks-burger-bun" />,
  ]);

  return (
    <DragDropContext
      onDragEnd={(result) => {
        if (!result.destination) {
          return;
        }
        const newItems = items;
        const [removed] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, removed);
        setItems(newItems);
      }}
    >
      <Droppable droppableId="droppable">
        {(droppableProvided, droppableSnapshot) => (
          <article
            id="franks-burger"
            ref={droppableProvided.innerRef}
            style={{
              background: droppableSnapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
              padding: grid,
              width: 250,
            }}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...droppableProvided.droppableProps}
          >
            {
              items.map((item, index) => (
                <Draggable
                  key={`drag-${index * 10}`}
                  draggableId={`drag-${index * 10}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <p
                      ref={provided.innerRef}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...provided.draggableProps}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: grid * 2,
                        margin: `0 0 ${grid}px 0`,
                        background: snapshot.isDragging ? 'lightgreen' : 'grey',
                        ...provided.draggableProps.style,
                      }}
                    >
                      {item}
                    </p>
                  )}
                </Draggable>
              ))
            }
            {droppableProvided.placeholder}
          </article>
        )}
      </Droppable>
    </DragDropContext>
  );
}
