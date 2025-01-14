export type HorizontalPlacement = 'middle' | 'left' | 'right' | 'auto';
export type VerticlePlacement = 'top' | 'bottom' | 'auto';

export interface IDropdownDiv {
  visible: boolean;
  placement?: HorizontalPlacement;
  verticlePlacement?: VerticlePlacement;
  transformOrigin?: 'center' | 'left' | 'right';
  arrow?: 'right';
}
