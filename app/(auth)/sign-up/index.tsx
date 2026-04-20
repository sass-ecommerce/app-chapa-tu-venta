import { SignUpForm } from '@/features/auth/components/sign-up-form';
import { ScrollView } from 'react-native';

export default function SignUpScreen() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="flex-grow"
      keyboardDismissMode="interactive"
      className="flex-1 bg-background">
      <SignUpForm />
    </ScrollView>
  );
}
