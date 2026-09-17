import { Easing, SlideInDown, SlideOutDown } from 'react-native-reanimated';

// Shared by the FAB and the selection bar so they read as one motion:
// the "+" button and the bar both pass through the same bottom edge,
// swapping places instead of animating independently.
const DURATION_IN = 240;
const DURATION_OUT = 180;

export const SELECTION_MODE_ENTERING = SlideInDown.duration(DURATION_IN).easing(
  Easing.out(Easing.cubic)
);
export const SELECTION_MODE_EXITING = SlideOutDown.duration(DURATION_OUT).easing(
  Easing.in(Easing.cubic)
);
