import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';
import { ScrollView } from 'react-native';

export default function ForgotPasswordScreen() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="flex-grow"
      keyboardDismissMode="interactive"
      className="flex-1 bg-background">
      <ForgotPasswordForm />
    </ScrollView>
  );
}
