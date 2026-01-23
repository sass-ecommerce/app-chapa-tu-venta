import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard, type Product } from '@/components/product-card';
import { Search } from 'lucide-react-native';
import * as React from 'react';
import { View, ScrollView, Pressable } from 'react-native';

// Categorías de productos
const CATEGORIES = ['All', 'Ropa', 'Accesorios', 'Zapatos', 'Electrónica'];

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

export default function ProductosScreen() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredProducts = DUMMY_PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="pt-20">
          {/* Search bar */}
          <View className="px-4 pb-4">
            <View className="relative">
              <Input
                placeholder="Search"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="h-12 rounded-full border-0 bg-muted pl-12"
                placeholderTextColor="#666"
              />
              <View className="absolute left-4 top-3">
                <Search size={20} color="#666" />
              </View>
            </View>
          </View>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 8,
              paddingHorizontal: 16,
              paddingBottom: 16,
            }}>
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                onPress={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`rounded-full ${selectedCategory === category ? 'bg-blue-500' : ''}`}>
                <Text
                  className={`font-medium ${
                    selectedCategory === category ? 'text-white' : 'text-foreground'
                  }`}>
                  {category}
                </Text>
              </Button>
            ))}
          </ScrollView>

          {/* Products Grid */}
          <View className="flex-row flex-wrap px-2">
            {filteredProducts.map((product) => (
              <View key={product.id} className="w-1/2 p-2">
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
