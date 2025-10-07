import { Suspense } from 'react';

import { CompensationRoot } from './features/compensation';
import { ThemeProvider } from './providers';

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="bg-background min-h-screen font-sans antialiased">
        <Suspense fallback={null}>
          <CompensationRoot />
        </Suspense>
      </div>
    </ThemeProvider>
  );
};

export default App;
