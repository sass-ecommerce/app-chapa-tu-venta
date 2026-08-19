import type { Option } from '@/shared/components/ui/select';

export const PRODUCT_ATTRIBUTE_OPTIONS: NonNullable<Option>[] = [
  { value: 'shoe_size', label: 'Talla de zapatilla' },
  { value: 'clothing_size', label: 'Talla de ropa' },
  { value: 'color', label: 'Color' },
  { value: 'material', label: 'Material' },
  { value: 'gender', label: 'Género' },
  { value: 'weight', label: 'Peso' },
];

/**
 * Valores sugeridos por tipo de atributo. Son solo un punto de partida:
 * el usuario siempre puede escribir un valor distinto en el input.
 */
export const PRODUCT_ATTRIBUTE_VALUE_SUGGESTIONS: Record<string, string[]> = {
  shoe_size: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'],
  clothing_size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  color: ['Negro', 'Blanco', 'Rojo', 'Azul', 'Verde', 'Gris', 'Beige'],
  material: ['Algodón', 'Cuero', 'Poliéster', 'Lana', 'Denim'],
  gender: ['Hombre', 'Mujer', 'Unisex'],
};
