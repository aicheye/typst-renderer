import init, { TypstCompiler, TypstCompilerBuilder } from '@myriaddreamin/typst-ts-web-compiler';
import { TypstDocument } from '@myriaddreamin/typst.react';
import { useEffect, useRef, useState } from 'react';
import { FiCheck, FiClipboard, FiDownload, FiGithub } from 'react-icons/fi';

TypstDocument.setWasmModuleInitOptions({
  beforeBuild: [],
  getModule: () => '/wasm/typst_ts_renderer_bg.wasm',
});

function App() {
  const [code, setCode] = useState<string>("r = frac(Sigma(x_i - overline(x))(y_i - overline(y)), sqrt(Sigma(x_i - overline(x))^2Sigma(y_i - overline(y))^2))");
  const [compiler, setCompiler] = useState<TypstCompiler | null>(null);
  const [artifact, setArtifact] = useState<Uint8Array | null>(null);
  const initialized = useRef(false);
  const renderRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initCompiler = async () => {
      await init('/wasm/typst_ts_web_compiler_bg.wasm');
      const builder = new TypstCompilerBuilder();

      const fonts = [
        '/fonts/LinLibertine_R.ttf',
        '/fonts/NewCMMath-Book.otf',
      ];

      for (const fontUrl of fonts) {
        const response = await fetch(fontUrl);
        const buffer = new Uint8Array(await response.arrayBuffer());
        await builder.add_raw_font(buffer);
      }

      const compiler = await builder.build();
      setCompiler(compiler);
    };
    initCompiler();
  }, []);

  useEffect(() => {
    if (compiler && code) {
      try {
        compiler.add_source('/main.typ', `#set page(width: auto, height: auto, margin: 5pt)\n$ ${code} $`);
        const artifact = compiler.compile('/main.typ', undefined, 'vector', 0);
        if (artifact) {
          setArtifact(artifact);
        }
      } catch (e) {
        console.error(e);
      }
    } else if (!code) {
      setArtifact(null);
    }
  }, [compiler, code]);

  const getRenderedCanvas = (): HTMLCanvasElement | null => {
    const el = renderRef.current;
    if (!el) return null;
    return el.querySelector('canvas');
  };

  async function copyRenderedImage() {
    const canvas = getRenderedCanvas();
    if (!canvas) {
      console.warn('No canvas found to copy');
      return;
    }

    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.warn('Failed to export image');
        return;
      }

      const hasClipboardImageSupport = typeof (window as any).ClipboardItem !== 'undefined' && typeof (navigator as any).clipboard !== 'undefined';

      if (hasClipboardImageSupport) {
        try {
          const item = new (window as any).ClipboardItem({ 'image/png': blob });
          await (navigator.clipboard as any).write([item]);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1000);
          return;
        } catch (err: any) {
          console.warn('Clipboard write failed, falling back to open:', err);
        }
      }

      // Fallback: open the image in a new tab so the user can manually copy/save it.
      try {
        const url = URL.createObjectURL(blob);
        const w = window.open(url, '_blank');
        // If popup opens, show copied state briefly as a convenience indicator
        if (w) {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1000);
        } else {
          console.warn('Popup blocked; consider using Download instead');
        }
        // revoke the object URL after a short delay
        window.setTimeout(() => URL.revokeObjectURL(url), 5000);
      } catch (err: any) {
        console.error('Fallback open failed', err);
      }
    }, 'image/png');
  }

  function downloadRenderedImage() {
    const canvas = getRenderedCanvas();
    if (!canvas) return alert('No canvas found to download');
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typst.png';
    a.click();
  }

  return (
    <>
      <div className="min-h-screen min-w-screen flex flex-col gap-8 items-center justify-center p-4">
        <div className="flex-1 flex flex-col gap-8 items-center justify-center w-full">
          <span className="text-2xl font-bold">Typst Renderer</span>
          <div className="flex flex-col gap-4 max-w-4xl w-full px-8 items-center justify-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg w-full flex items-center justify-center">
              <textarea
                className="no-outline border-none w-full h-full p-4 outline-none text-center text-2xl"
                placeholder="paste typst code here"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                autoCorrect="off"
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Typst formula input"
              />
            </div>
            <div className="border-2 rounded-lg w-full h-64 flex items-center justify-center overflow-auto bg-white text-black">
              <div className="w-full flex flex-col items-center p-2">
                <div ref={renderRef} className="w-full flex items-center justify-center">
                  {artifact ? (
                    <TypstDocument artifact={artifact} />
                  ) : (
                    <span className="text-gray-400">rendered output will appear here</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={copyRenderedImage}
                className="px-3 py-1 rounded flex items-center gap-2 transition-colors duration-300"
                style={
                  copied ? { backgroundColor: '#d1fae5', color: '#065f46' } : {}
                }
              >
                {copied ? <><FiCheck /> Copied!</> : <><FiClipboard /> Copy</>}
              </button>
              <button
                type="button"
                onClick={downloadRenderedImage}
                className="px-3 py-1 bg-gray-100 rounded flex items-center gap-2"
              >
                <FiDownload /> Download
              </button>
            </div>
          </div>
        </div>
        <footer className="text-gray-500">
          <a href="https://github.com/aicheye/typst-renderer" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <FiGithub /> See Source
          </a>
        </footer>
      </div>
    </>
  )
}

export default App

