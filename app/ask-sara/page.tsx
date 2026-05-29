import { redirect } from 'next/navigation';

export default function AskSaraPage() {
  // Redirect to home with the ask-sara trigger
  redirect('/?ask-sara=true');
}
