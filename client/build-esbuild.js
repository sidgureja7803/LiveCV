// Direct build script using esbuild to avoid Vite's stack overflow issues
import * as esbuild from 'esbuild';
import { copyFile, mkdir } from 'fs/promises';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

// Get current directory
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Config
const srcDir = join(__dirname, 'src');
const publicDir = join(__dirname, 'public');
const outDir = join(__dirname, 'dist');
const entryPoint = join(srcDir, 'main.tsx');

async function build() {
  console.log('🔨 Building with esbuild to avoid stack overflow issues...');
  
  try {
    // Ensure dist directory exists
    if (!existsSync(outDir)) {
      await mkdir(outDir, { recursive: true });
    }
    
    // Copy public directory contents to dist
    console.log('📂 Copying public assets...');
    await copyPublicDir(publicDir, outDir);
    
    // Build with esbuild
    console.log('🏗️ Building JavaScript bundle...');
    const result = await esbuild.build({
      entryPoints: [entryPoint],
      bundle: true,
      outdir: outDir,
      format: 'esm',
      splitting: true,
      sourcemap: false,
      minify: true,
      target: 'es2020',
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
        '.tsx': 'tsx',
        '.jsx': 'jsx',
        '.css': 'css',
        '.json': 'json',
        '.svg': 'dataurl',
        '.png': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.gif': 'file',
      },
      define: {
        'process.env.NODE_ENV': '"production"',
        'import.meta.env.VITE_API_BASE_URL': `"${process.env.VITE_API_BASE_URL || 'http://localhost:5001'}"`,
      },
    });
    
    console.log('✅ Build completed successfully!');
    console.log(`📦 Output written to ${outDir}`);
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Helper to copy public directory to dist
async function copyPublicDir(source, destination) {
  try {
    // Copy index.html
    if (existsSync(join(source, 'index.html'))) {
      await copyFile(
        join(source, 'index.html'),
        join(destination, 'index.html')
      );
      console.log('✅ Copied index.html');
    } else {
      console.warn('⚠️ No index.html found in public directory');
    }
    
    // Copy favicon
    if (existsSync(join(source, 'favicon.ico'))) {
      await copyFile(
        join(source, 'favicon.ico'),
        join(destination, 'favicon.ico')
      );
      console.log('✅ Copied favicon.ico');
    }
    
    console.log('✅ Public directory copied to dist');
  } catch (error) {
    console.error('❌ Error copying public directory:', error);
  }
}

// Run the build
build();
