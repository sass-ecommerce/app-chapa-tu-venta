import { SignInForm } from '@/features/auth/components/sign-in-form';
import { ScrollView } from 'react-native';

export default function SignInScreen() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="flex-grow"
      keyboardDismissMode="interactive"
      className="flex-1 bg-background">
      <SignInForm />
    </ScrollView>
  );
}
