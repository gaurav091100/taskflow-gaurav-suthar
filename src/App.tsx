import { AppProviders } from "./app/Providers";
import { AppRouter } from "./app/Router";

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}


