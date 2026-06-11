import * as React from 'react';
import { Modal, View, KeyboardAvoidingView, Pressable } from 'react-native';
import { X } from 'lucide-react-native';

import { Text } from '@/shared/components/ui/text';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Icon } from '@/shared/components/ui/icon';
import type { Category, CreateCategoryData } from '../types';

function toSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

interface CategoryFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: CreateCategoryData) => void;
  isLoading?: boolean;
  editCategory?: Category;
  parentName?: string;
}

export function CategoryFormModal({
  visible,
  onClose,
  onSave,
  isLoading,
  editCategory,
  parentName,
}: CategoryFormModalProps) {
  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');

  React.useEffect(() => {
    if (visible) {
      setName(editCategory?.name ?? '');
      setSlug(editCategory?.slug ?? '');
    }
  }, [visible, editCategory]);

  const handleNameChange = (text: string) => {
    setName(text);
    if (!editCategory) {
      setSlug(toSlug(text));
    }
  };

  const isEditing = !!editCategory;
  const isValid = name.trim().length > 0;

  const handleSave = () => {
    if (!isValid) return;
    onSave({ name: name.trim(), slug });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="rounded-t-3xl bg-background px-6 pb-10 pt-4">
            {/* Drag handle */}
            <View className="mb-5 h-1 w-10 self-center rounded-full bg-muted-foreground/30" />

            {/* Header */}
            <View className="mb-6 flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-xl font-bold text-foreground">
                  {isEditing ? 'Editar categoría' : 'Nueva categoría'}
                </Text>
                {parentName && (
                  <Text className="mt-0.5 text-sm text-muted-foreground">
                    dentro de {parentName}
                  </Text>
                )}
              </View>
              <Pressable onPress={onClose} className="rounded-full p-1.5 active:bg-muted">
                <Icon as={X} size={20} className="text-muted-foreground" />
              </Pressable>
            </View>

            {/* Name */}
            <View className="mb-4">
              <Label className="mb-2 text-sm font-medium">Nombre *</Label>
              <Input
                placeholder="Ej: Bebidas"
                value={name}
                onChangeText={handleNameChange}
                className="h-12"
                autoFocus
              />
            </View>

            {/* Slug — read-only, auto-generated */}
            <View className="mb-6">
              <View className="mb-2 flex-row items-center justify-between">
                <Label className="text-sm font-medium">Slug</Label>
                <Text className="text-xs text-muted-foreground">generado automáticamente</Text>
              </View>
              <Input
                value={slug}
                editable={false}
                className="h-12 bg-muted/40"
                placeholderTextColor="transparent"
              />
            </View>

            {/* Actions */}
            <View className="gap-3">
              <Button onPress={handleSave} disabled={!isValid || isLoading} size="lg">
                <Text className="font-semibold">
                  {isLoading
                    ? 'Guardando...'
                    : isEditing
                      ? 'Guardar cambios'
                      : 'Crear categoría'}
                </Text>
              </Button>
              <Button variant="outline" size="lg" onPress={onClose}>
                <Text>Cancelar</Text>
              </Button>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
