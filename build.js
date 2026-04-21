#!/usr/bin/env node
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nodeExe = 'C:\\Program Files\\nodejs\\node.exe';
const npmCmd = 'C:\\Program Files\\nodejs\\npm.cmd';

console.log('🔨 Building project...');

try {
  console.log('📦 Installing dependencies...');
  execSync(`"${npmCmd}" install --legacy-peer-deps`, { 
    cwd: __dirname,
    stdio: 'inherit'
  });

  console.log('🏗️  Running build...');
  execSync(`"${npmCmd}" run build`, { 
    cwd: __dirname,
    stdio: 'inherit'
  });

  console.log('✅ Build complete!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
