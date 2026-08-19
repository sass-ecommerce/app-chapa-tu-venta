import * as React from 'react';
import { View } from 'react-native';
import { Footprints, LucideIcon, Mars, Ruler, Scale, Shirt, Users, Venus, VenusAndMars } from 'lucide-react-native';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/utils/utils';
import type { ProductAttribute } from '../types';

const COLOR_SWATCHES: Record<string, string> = {
  negro: '#171717',
  blanco: '#FAFAFA',
  rojo: '#DC2626',
  azul: '#2563EB',
  verde: '#16A34A',
  gris: '#6B7280',
  beige: '#D6C7A1',
  marrón: '#78350F',
  amarillo: '#EAB308',
  rosado: '#EC4899',
  morado: '#7C3AED',
  naranja: '#D9711A',
};

const GENDER_ICONS: Record<string, LucideIcon> = {
  hombre: Mars,
  mujer: Venus,
  unisex: VenusAndMars,
};

function IconValue({ icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      <Icon as={icon} size={15} className="text-muted-foreground" />
      <Text className="font-semibold text-foreground">{value}</Text>
    </View>
  );
}

function ColorValue({ value }: { value: string }) {
  const hex = COLOR_SWATCHES[value.trim().toLowerCase()];
  return (
    <View className="flex-row items-center gap-2">
      {hex && (
        <View
          className={cn(
            'h-4 w-4 rounded-full border border-border/60',
            hex.toLowerCase() === '#fafafa' && 'border-border'
          )}
          style={{ backgroundColor: hex }}
        />
      )}
      <Text className="font-semibold text-foreground">{value}</Text>
    </View>
  );
}

function WeightValue({ value }: { value: string }) {
  const isNumeric = /^\d+(\.\d+)?$/.test(value.trim());
  return (
    <View className="flex-row items-center gap-1.5">
      <Icon as={Scale} size={15} className="text-muted-foreground" />
      <Text className="font-semibold tabular-nums text-foreground">
        {isNumeric ? `${value} g` : value}
      </Text>
    </View>
  );
}

export function AttributeValue({ attribute }: { attribute: ProductAttribute }) {
  switch (attribute.attributeKey) {
    case 'color':
      return <ColorValue value={attribute.value} />;
    case 'shoe_size':
      return <IconValue icon={Footprints} value={attribute.value} />;
    case 'clothing_size':
      return <IconValue icon={Ruler} value={attribute.value} />;
    case 'material':
      return <IconValue icon={Shirt} value={attribute.value} />;
    case 'gender':
      return (
        <IconValue
          icon={GENDER_ICONS[attribute.value.trim().toLowerCase()] ?? Users}
          value={attribute.value}
        />
      );
    case 'weight':
      return <WeightValue value={attribute.value} />;
    default:
      return <Text className="font-medium text-foreground">{attribute.value}</Text>;
  }
}
