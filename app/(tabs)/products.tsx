import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard, type Product } from '@/components/product-card';
import { Search, Bell, Menu, Plus, FolderPlus } from 'lucide-react-native';
import * as React from 'react';
import { Alert, View, ScrollView, Pressable } from 'react-native';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  const [hasNotifications, setHasNotifications] = React.useState(true); // Estado para notificaciones

  const filteredProducts = DUMMY_PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="pt-12">
          {/* Search bar with menu and notification bell */}
          <View className="flex-row items-center gap-3 px-4 pb-4">
            {/* Menu Button with Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Menu size={22} color="#666" />
                </Pressable>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-0">
                <View>
                  <Pressable
                    onPress={() => Alert.alert('Crear Producto', 'Navegar a crear producto')}
                    className="flex-row items-center gap-3 px-4 py-3 active:bg-accent">
                    <Plus size={18} color="#666" />
                    <Text className="text-base">Crear producto</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => Alert.alert('Crear Colección', 'Navegar a crear colección')}
                    className="flex-row items-center gap-3 px-4 py-3 active:bg-accent">
                    <FolderPlus size={18} color="#666" />
                    <Text className="text-base">Crear colección</Text>
                  </Pressable>
                </View>
              </PopoverContent>
            </Popover>

            <View className="relative flex-1">
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

            {/* Notification Bell */}
            <Pressable
              onPress={() => setHasNotifications(!hasNotifications)}
              className="relative h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Bell size={22} color="#666" />
              {hasNotifications && (
                <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
              )}
            </Pressable>
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
