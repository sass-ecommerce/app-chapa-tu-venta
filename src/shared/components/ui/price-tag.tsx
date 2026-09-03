import * as React from 'react';
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Polygon } from 'react-native-svg';

interface PriceTagProps {
  fill: string;
  stroke: string;
  holeColor: string;
  cut?: number;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  className?: string;
  children: React.ReactNode;
}

/**
 * Wraps content in a price-tag silhouette — a diagonal-cut top-left corner
 * with a punch hole — like a paper tag hung on a product. Size is measured
 * on layout so the cut stays a fixed size regardless of the tag's own width.
 */
export function PriceTag({
  fill,
  stroke,
  holeColor,
  cut = 14,
  strokeWidth = 2,
  style,
  className,
  children,
}: PriceTagProps) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const holeCenter = cut / 2 + 3;

  return (
    <View className={className} style={style} onLayout={onLayout}>
      {size.width > 0 && size.height > 0 && (
        <Svg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          style={{ position: 'absolute', top: 0, left: 0 }}
          pointerEvents="none">
          <Polygon
            points={`${cut},0 ${size.width},0 ${size.width},${size.height} 0,${size.height} 0,${cut}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <Circle
            cx={holeCenter}
            cy={holeCenter}
            r={cut / 4.5}
            fill={holeColor}
            stroke={stroke}
            strokeWidth={strokeWidth * 0.75}
          />
        </Svg>
      )}
      {children}
    </View>
  );
}
