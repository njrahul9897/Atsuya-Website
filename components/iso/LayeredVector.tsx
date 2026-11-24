import { cn } from "@/lib/cn";

// A generated 2.5D illustration (see scripts/build-illustrations.ts), drawn as a stack of layers
// in order: the static art as SVG images (rasterised once by the browser, so they cost no DOM)
// and, between them, the animated AOne layer as inline SVG, so page CSS can drive its classes.
export type VectorScene = { viewBox: number[]; layers: { kind: string; src?: string; markup?: string }[] };

export function LayeredVector({ scene, label, className }: { scene: VectorScene; label: string; className?: string }) {
  const [x, y, width, height] = scene.viewBox;
  return (
    <div className={cn("relative", className)} style={{ aspectRatio: `${width} / ${height}` }} role="img" aria-label={label}>
      {scene.layers.map((layer, index) =>
        layer.kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element -- a vector layer: nothing for next/image to optimise
          <img key={index} src={layer.src} alt="" width={width} height={height} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full" />
        ) : (
          <svg key={index} viewBox={`${x} ${y} ${width} ${height}`} aria-hidden="true" className="absolute inset-0 h-full w-full" dangerouslySetInnerHTML={{ __html: layer.markup ?? "" }} />
        ),
      )}
    </div>
  );
}
