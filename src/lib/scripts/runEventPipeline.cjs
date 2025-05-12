// CommonJS wrapper for running the event pipeline
const { execSync } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

// Load .env.local file
console.log('Loading environment variables from .env.local...');
const result = dotenv.config({ path: '.env.local' });

if (result.error) {
  console.error('Error loading .env.local file:', result.error);
  process.exit(1);
} else {
  console.log('.env.local file loaded successfully');
  
  // Check for required environment variables
  const requiredVars = ['PERPLEXITY_API_KEY', 'OPENAI_API', 'PINECONE_API_KEY', 'MONGODB_URI'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    console.error('Please add these to your .env.local file');
    process.exit(1);
  } else {
    console.log('All required environment variables found');
  }
}

try {
  // Use ts-node-esm to run the ESM module
  const routePath = path.resolve(process.cwd(), 'src/app/api/events/route.ts');
  console.log('Running event pipeline...');
  
  execSync(`node --loader ts-node/esm ${routePath}`, { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--experimental-specifier-resolution=node'
    }
  });
} catch (error) {
  console.error('Failed to run event pipeline:', error);
  process.exit(1);
} 