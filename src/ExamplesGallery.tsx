import type { TypstCompiler } from '@myriaddreamin/typst-ts-web-compiler';
import { TypstDocument } from '@myriaddreamin/typst.react';
import { useEffect, useState } from 'react';
import { examples } from './examples';

type Props = {
  compiler: TypstCompiler | null;
  onSelect: (value: string) => void;
};

export default function ExamplesGallery({ compiler, onSelect }: Props) {
  const [artifacts, setArtifacts] = useState<Array<Uint8Array | null>>([]);

  useEffect(() => {
    if (!compiler) {
      setArtifacts([]);
      return;
    }

    const arts: Array<Uint8Array | null> = examples.map((ex, i) => {
      try {
        const path = `/example_${i}.typ`;
        compiler.add_source(path, `#set page(width: auto, height: auto, margin: 2pt)\n$ ${ex} $`);
        const art = compiler.compile(path, undefined, 'vector', 0);
        return art ?? null;
      } catch (e) {
        console.error('Example compile error for', ex, e);
        return null;
      }
    });

    setArtifacts(arts);
  }, [compiler]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <span className="text-md font-semibold">Examples</span>
      <div className="relative overflow-visible max-w-[60vw] w-fit border border-gray-300 rounded-lg p-4">
        <div className="overflow-x-auto w-full">
          <div className="w-full flex flex-row gap-3 mt-4">
            {examples.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(ex)}
                className="flex-shrink-0 border rounded p-2 bg-white hover:bg-gray-50"
                style={{ minWidth: 120, minHeight: 64 }}
                aria-label={`Insert example ${ex}`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {artifacts[i] ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypstDocument artifact={artifacts[i] as Uint8Array} fill="#f9f9f9" />
                    </div>
                  ) : (
                    <div className="text-center text-sm text-gray-700">{ex}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
