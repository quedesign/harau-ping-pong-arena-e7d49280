
declare module 'react-beautiful-dnd' {
  import * as React from 'react';

  export type Id = string;
  export type DraggableId = Id;
  export type DroppableId = Id;
  export type TypeId = Id;
  export type ZIndex = React.CSSProperties['zIndex'];
  export type DropReason = 'DROP' | 'CANCEL';
  export type Announce = (message: string) => void;

  export interface Position {
    x: number;
    y: number;
  }

  export type MovementMode = 'FLUID' | 'SNAP';

  export interface DraggableLocation {
    droppableId: DroppableId;
    index: number;
  }

  export interface DraggableRubric {
    draggableId: DraggableId;
    type: TypeId;
    source: DraggableLocation;
  }

  export type VerticalAlignment = 'top' | 'center' | 'bottom';

  export type HorizontalAlignment = 'left' | 'center' | 'right';

  export interface DraggingStyle {
    position: 'fixed';
    top: number;
    left: number;
    boxSizing: 'border-box';
    width: number;
    height: number;
    transition: string;
    zIndex: ZIndex;
    transform: string;
    pointerEvents: 'none';
  }

  export interface NotDraggingStyle {
    transform?: string;
    transition?: 'none';
  }

  export type DraggableStyle = DraggingStyle | NotDraggingStyle;

  export interface DraggableProps {
    draggableId: DroppableId;
    index: number;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactElement;
  }

  export class Draggable extends React.Component<DraggableProps> {}

  export interface DroppableProps {
    droppableId: DroppableId;
    type?: TypeId;
    ignoreContainerClipping?: boolean;
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    direction?: 'vertical' | 'horizontal';
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactElement;
  }

  export class Droppable extends React.Component<DroppableProps> {}

  export interface DragDropContextProps {
    onBeforeCapture?: (before: BeforeCapture) => void;
    onBeforeDragStart?: (initial: DragStart) => void;
    onDragStart?: (initial: DragStart) => void;
    onDragUpdate?: (update: DragUpdate) => void;
    onDragEnd: (result: DropResult) => void;
    children: React.ReactNode;
  }

  export class DragDropContext extends React.Component<DragDropContextProps> {}

  export interface BeforeCapture {
    draggableId: DraggableId;
    mode: MovementMode;
  }

  export interface DragStart extends DraggableRubric {
    mode: MovementMode;
  }

  export interface DragUpdate extends DragStart {
    destination?: DraggableLocation;
    combine?: Combine;
  }

  export interface DropResult extends DragUpdate {
    reason: DropReason;
  }

  export interface Combine {
    draggableId: DraggableId;
    droppableId: DroppableId;
  }

  export interface DraggableProvided {
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProps & {
      style?: DraggableStyle;
    };
    dragHandleProps: DragHandleProps | null;
  }

  export interface DraggableStateSnapshot {
    isDragging: boolean;
    isDropAnimating: boolean;
    isClone: boolean;
    dropAnimation: DropAnimation | null;
    draggingOver: DroppableId | null;
    combineWith: DraggableId | null;
    combineTargetFor: DraggableId | null;
    mode: MovementMode | null;
  }

  export interface DropAnimation {
    duration: number;
    curve: string;
    moveTo: Position;
    opacity: number | null;
    scale: number | null;
  }

  export interface DragHandleProps {
    role: string;
    tabIndex: number;
    'aria-describedby': string;
    'data-rbd-drag-handle-draggable-id': string;
    'data-rbd-drag-handle-context-id': string;
    draggable: boolean;
    onDragStart: React.DragEventHandler<any>;
  }

  export interface DroppableProvided {
    innerRef: (element: HTMLElement | null) => void;
    placeholder?: React.ReactElement | null;
    droppableProps: {
      'data-rbd-droppable-context-id': string;
      'data-rbd-droppable-id': string;
    };
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
    draggingOverWith: DraggableId | null;
    draggingFromThisWith: DraggableId | null;
    isUsingPlaceholder: boolean;
  }
}
