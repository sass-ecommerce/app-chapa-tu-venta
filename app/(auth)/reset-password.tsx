import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';
import { ScrollView } from 'react-native';

export default function ResetPasswordScreen() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="flex-grow"
      keyboardDismissMode="interactive"
      className="flex-1 bg-background">
      <ResetPasswordForm />
    </ScrollView>
  );
}
