import express from 'express';
import { WASI } from '@wasmer/wasi';
import { WasmFs } from '@wasmer/wasmfs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { writeFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Initialize WebAssembly filesystem
const wasmFs = new WasmFs();

router.post('/execute', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'No code provided' });
    }

    // Create a temporary directory for compilation
    const tempDir = join(__dirname, '../temp');
    const timestamp = Date.now();
    const asmFile = join(tempDir, `code-${timestamp}.asm`);
    
    // Write assembly code to file
    await writeFile(asmFile, code);

    // Initialize WASI
    const wasi = new WASI({
      args: [],
      env: {},
      bindings: {
        ...WASI.defaultBindings,
        fs: wasmFs.fs
      }
    });

    try {
      // Compile and execute the assembly code
      const instance = await WebAssembly.instantiate(
        await WebAssembly.compile(await readFile(asmFile)),
        {
          wasi_snapshot_preview1: wasi.wasiImport
        }
      );

      // Start the WASI instance
      wasi.start(instance);

      // Get the output from the virtual filesystem
      const stdout = wasmFs.fs.readFileSync('/dev/stdout').toString();
      const stderr = wasmFs.fs.readFileSync('/dev/stderr').toString();

      if (stderr) {
        return res.status(400).json({ error: stderr });
      }

      res.json({ output: stdout });
    } catch (error) {
      return res.status(400).json({ 
        error: 'Compilation error',
        details: error.message 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      details: error.message 
    });
  }
});

export default router;