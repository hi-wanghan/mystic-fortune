const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'app/globals.css',
  'app/layout.tsx',
  'app/page.tsx',
  'components/BirthForm.tsx',
  'components/LoadingSpinner.tsx',
  'components/PaymentButton.tsx',
  'types/index.ts',
  'lib/supabase.ts',
  '.env.local'
];

console.log('🔍 Verifying project structure...\n');

let allGood = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file}`);
  if (!exists) allGood = false;
});

console.log(allGood ? '\n✅ All files present!' : '\n❌ Missing files detected!');