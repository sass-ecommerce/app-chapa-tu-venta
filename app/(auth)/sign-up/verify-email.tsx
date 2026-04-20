import { VerifyEmailForm } from '@/features/auth/components/verify-email-form';
import { ScrollView } from 'react-native';

export default function VerifyEmailScreen() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="flex-grow"
      keyboardDismissMode="interactive"
      className="flex-1 bg-background">
      <VerifyEmailForm />
    </ScrollView>
  );
}
