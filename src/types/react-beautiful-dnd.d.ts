
declare module 'react-beautiful-dnd' {
  import * as React from 'react';

  // Element types
  export type DraggableId = string;
  export type DroppableId = string;
  export type TypeId = string;
  export type ZIndex = number | string;
  export type DropReason = 'DROP' | 'CANCEL';
  export type Announce = (message: string) => void;

  // Hooks
  export function useKeyboardSensor(args: any): any;
  export function useMouseSensor(args: any): any;
  export function useTouchSensor(args: any): any;

  // Styles
  export interface Style {
    [key: string]: string | number;
  }

  // Responders
  export type OnBeforeCaptureResponder = (before: BeforeCapture) => void;
  export type OnBeforeDragStartResponder = (start: DragStart) => void;
  export type OnDragStartResponder = (start: DragStart, provided: ResponderProvided) => void;
  export type OnDragUpdateResponder = (update: DragUpdate, provided: ResponderProvided) => void;
  export type OnDragEndResponder = (result: DropResult, provided: ResponderProvided) => void;

  export interface ResponderProvided {
    announce: Announce;
  }

  // State
  export interface BeforeCapture {
    draggableId: DraggableId;
    mode: MovementMode;
  }

  export interface DraggableLocation {
    droppableId: DroppableId;
    index: number;
  }

  export interface DragStart {
    draggableId: DraggableId;
    type: TypeId;
    source: DraggableLocation;
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

  // Components
  export interface DraggableChildrenFn {
    (
      provided: DraggableProvided,
      snapshot: DraggableStateSnapshot,
      rubric: DraggableRubric,
    ): React.ReactNode;
  }

  export interface DroppableChildrenFn {
    (
      provided: DroppableProvided,
      snapshot: DroppableStateSnapshot,
    ): React.ReactNode;
  }

  // Components
  export type MovementMode = 'FLUID' | 'SNAP';

  export interface DraggableProps {
    draggableId: DraggableId;
    index: number;
    children: DraggableChildrenFn;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    shouldRespectForcePress?: boolean;
  }

  export interface DroppableProps {
    droppableId: DroppableId;
    children: DroppableChildrenFn;
    type?: TypeId;
    mode?: MovementMode;
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    ignoreContainerClipping?: boolean;
    renderClone?: DraggableChildrenFn;
    getContainerForClone?: () => HTMLElement;
  }

  export interface DragDropContextProps {
    children: React.ReactNode;
    onBeforeCapture?: OnBeforeCaptureResponder;
    onBeforeDragStart?: OnBeforeDragStartResponder;
    onDragStart?: OnDragStartResponder;
    onDragUpdate?: OnDragUpdateResponder;
    onDragEnd: OnDragEndResponder;
    enableDefaultSensors?: boolean;
    sensors?: React.ReactNode;
  }

  // Provided
  export interface DraggableProvided {
    innerRef: (element?: HTMLElement | null) => void;
    draggableProps: DraggableProps;
    dragHandleProps: DragHandleProps | null;
  }

  export interface DroppableProvided {
    innerRef: (element?: HTMLElement | null) => void;
    droppableProps: DroppableProps;
    placeholder?: React.ReactNode;
  }

  export interface DragHandleProps {
    onFocus: () => void;
    onBlur: () => void;
    onMouseDown: (event: React.MouseEvent<any>) => void;
    onKeyDown: (event: React.KeyboardEvent<any>) => void;
    onTouchStart: (event: React.TouchEvent<any>) => void;
    tabIndex: number;
    'aria-grabbed': boolean;
    draggable: boolean;
    onDragStart: () => void;
    onDrop: () => void;
  }

  // State
  export interface DraggableStateSnapshot {
    isDragging: boolean;
    isDropAnimating: boolean;
    dropAnimation?: DropAnimation;
    draggingOver?: DroppableId;
    combineWith?: DraggableId;
    combineTargetFor?: DraggableId;
    mode?: MovementMode;
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
    draggingOverWith?: DraggableId;
    draggingFromThisWith?: DraggableId;
    isUsingPlaceholder: boolean;
  }

  export interface DropAnimation {
    duration: number;
    curve: string;
    moveTo: Position;
    opacity?: number;
    scale?: number;
  }

  export interface Position {
    x: number;
    y: number;
  }

  export interface DraggableRubric {
    draggableId: DraggableId;
    type: TypeId;
    source: DraggableLocation;
  }

  // Components
  export class DragDropContext extends React.Component<DragDropContextProps> {}
  export class Droppable extends React.Component<DroppableProps> {}
  export class Draggable extends React.Component<DraggableProps> {}
}
