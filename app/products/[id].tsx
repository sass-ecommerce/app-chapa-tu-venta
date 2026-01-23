import { Product } from '@/components/product-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Flame, ShoppingCart, Star } from 'lucide-react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Image, ScrollView, View } from 'react-native';
// Data dummy de productos
const DUMMY_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Creatine Monohydrate',
    price: 45.0,
    originalPrice: 50.0,
    image: {
      uri: 'https://media.falabella.com/falabellaPE/119678928_01/w=1500,h=1500,fit=cover',
    },
    rating: 4.8,
    category: 'Ropa',
    stock: 25,
    trending: true,
  },
  {
    id: '2',
    name: 'Women Sneakers',
    price: 30.0,
    image: {
      uri: 'https://s.alicdn.com/@sc04/kf/H3b09d241e10c45598ff0769cdd8578c7P/Women-s-Comfortable-Sneakers-Air-Cushion-Thick-Soles-Red-Lace-up-Casual-Running-Shoes-Tennis-Shoes.jpg_300x300.jpg',
    },
    rating: 4.5,
    category: 'Zapatos',
    stock: 15,
  },
  {
    id: '3',
    name: 'Casual Sneakers',
    price: 55.0,
    originalPrice: 65.0,
    image: {
      uri: 'https://sc04.alicdn.com/kf/Ha1ab137ebb2b41e09cf6dbf33f5042b25.jpg',
    },
    rating: 4.7,
    category: 'Zapatos',
    stock: 8,
    trending: true,
  },
  {
    id: '4',
    name: 'Sport Shoes',
    price: 25.0,
    image: {
      uri: 'https://m.media-amazon.com/images/I/51muje9h1RL._AC_SY300_.jpg',
    },
    rating: 4.6,
    category: 'Zapatos',
    stock: 42,
  },
  {
    id: '5',
    name: 'Running Shoes',
    price: 15.0,
    image: {
      uri: 'https://media.falabella.com/falabellaPE/119678928_01/w=1500,h=1500,fit=cover',
    },
    rating: 4.3,
    category: 'Zapatos',
    stock: 12,
    trending: true,
  },
];

export default function ProductoDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Buscar el producto por ID
  const product = DUMMY_PRODUCTS.find((p) => p.id === id);

  // Si no se encuentra el producto, mostrar mensaje
  if (!product) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Producto No Encontrado',
            headerBackTitle: 'Productos',
          }}
        />
        <View className="flex-1 items-center justify-center bg-background p-4">
          <Text className="text-lg text-muted-foreground">Producto no encontrado</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: product.name,
          headerBackTitle: 'Productos',
        }}
      />
      <ScrollView className="flex-1 bg-background">
        {/* Imagen del producto */}
        <View className="relative">
          <Image source={product.image} style={{ width: '100%', height: 400 }} resizeMode="cover" />

          {/* Badge de trending si aplica */}
          {product.trending && (
            <View className="absolute right-4 top-4">
              <Badge variant="destructive" className="flex-row items-center gap-1">
                <Flame size={14} color="white" />
                <Text className="text-xs font-semibold text-white">Trending</Text>
              </Badge>
            </View>
          )}

          {/* Rating badge */}
          <View className="absolute bottom-4 left-4">
            <Badge variant="outline" className="flex-row items-center gap-1 bg-white">
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text className="text-xs font-semibold">{product.rating}</Text>
            </Badge>
          </View>
        </View>

        {/* Información del producto */}
        <View className="p-6">
          {/* Nombre y categoría */}
          <Text className="text-2xl font-bold">{product.name}</Text>
          <Text className="mt-2 text-sm text-muted-foreground">{product.category}</Text>

          {/* Precio */}
          <View className="mt-4 flex-row items-center gap-3">
            <Text className="text-3xl font-bold text-primary">S/ {product.price.toFixed(2)}</Text>
            {product.originalPrice && (
              <Text className="text-lg text-muted-foreground line-through">
                S/ {product.originalPrice.toFixed(2)}
              </Text>
            )}
          </View>

          {/* Stock */}
          <View className="mt-3">
            <Text className="text-sm">
              Stock:{' '}
              <Text
                className={`font-semibold ${product.stock < 10 ? 'text-destructive' : 'text-green-600'}`}>
                {product.stock} unidades
              </Text>
            </Text>
          </View>

          {/* Descripción (placeholder) */}
          <View className="mt-6">
            <Text className="text-lg font-semibold">Descripción</Text>
            <Text className="mt-2 leading-6 text-muted-foreground">
              Este es un producto de alta calidad que cumple con todos los estándares de
              fabricación. Perfecto para uso diario y diseñado para brindar comodidad y durabilidad.
              Disponible en nuestra tienda con envío rápido.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
