# Asset Review — Per-Asset Benchmarks

> **For platform-level budgets** (total memory, frame budget, draw calls), see
> `game-eng-review/references/performance-budgets.md`. This file covers
> **per-asset guidelines** only.

## Texture — Max Size Per Object Type

| Object Type | Mobile (low) | Mobile (high) | PC / Console | Web/WebGL |
|-------------|-------------|---------------|-------------|-----------|
| Hero character | 1024x1024 | 2048x2048 | 4096x4096 | 1024x1024 |
| NPC / secondary | 512x512 | 1024x1024 | 2048x2048 | 512x512 |
| Environment prop | 256x256 | 512x512 | 1024x1024 | 256x256 |
| Background / skybox | 1024x1024 | 2048x2048 | 4096x4096 | 1024x1024 |
| UI element | 128-512 | 256-1024 | 512-2048 | 128-512 |
| VFX / particle | 128x128 | 256x256 | 512x512 | 128x128 |
| Tilemap tile | 32-64 | 64-128 | 128-256 | 32-64 |

## Texture — Recommended Formats

| Platform | Opaque | With Alpha | UI / Lossless | Normal Map |
|----------|--------|-----------|--------------|------------|
| Mobile (Android) | ETC2 / ASTC 6x6 | ASTC 4x4 | PNG (small) | ASTC 4x4 |
| Mobile (iOS) | ASTC 6x6 | ASTC 4x4 | PNG (small) | ASTC 4x4 |
| PC / Console | BC7 | BC7 | BC7 / PNG | BC5 |
| Web/WebGL | Basis / KTX2 | Basis / KTX2 | PNG | Basis |

## Texture — Compression Ratio Guidelines

| Format | Approximate Ratio vs RGBA32 | Bits/Pixel |
|--------|----------------------------|------------|
| RGBA32 (uncompressed) | 1x (baseline) | 32 |
| ASTC 4x4 | 4x smaller | 8 |
| ASTC 6x6 | 7x smaller | 3.56 |
| BC7 | 4x smaller | 8 |
| BC1/DXT1 (no alpha) | 8x smaller | 4 |
| ETC2 RGB | 6x smaller | 4 |
| PNG (disk only) | varies | lossless |

Rule of thumb: if an asset uses >4 bits/pixel on mobile, it needs justification.

## Mesh — Poly Budget Per Object

| Object Type | Mobile (low) | Mobile (high) | PC / Console |
|-------------|-------------|---------------|-------------|
| Hero character | 3-5K tris | 10-20K tris | 30-100K tris |
| NPC / secondary | 1-3K tris | 5-10K tris | 15-50K tris |
| Environment prop (small) | 100-500 tris | 500-2K tris | 2-10K tris |
| Environment prop (large) | 500-2K tris | 2-5K tris | 5-20K tris |
| Vehicle | 3-8K tris | 10-25K tris | 30-80K tris |
| Foliage instance | 50-200 tris | 200-500 tris | 500-2K tris |

## Mesh — LOD Expectations

| Platform | LOD levels expected | LOD0 → LOD1 reduction |
|----------|--------------------|-----------------------|
| Mobile | 1-2 LODs | 50% tri reduction |
| PC / Console | 2-4 LODs | 50% per level |
| Web | 1-2 LODs | 50% tri reduction |

If no LODs exist on any mesh: flag as finding. LODs are expected for any object >1K tris on mobile, >5K tris on PC.

## Atlas / Sprite Sheet Utilization

| Rating | Fill % | Status |
|--------|--------|--------|
| Good | >80% | Efficient packing |
| Acceptable | 60-80% | Minor waste, review layout |
| Poor | <60% | Significant wasted space — repack or split |

Sprite sheets: max recommended size 2048x2048 on mobile, 4096x4096 on PC. Prefer multiple smaller sheets over one enormous sheet (reduces memory when only a subset is needed).

## Audio — Format Per Use Case

| Use Case | Recommended Format | Sample Rate | Notes |
|----------|-------------------|-------------|-------|
| Music / BGM | OGG Vorbis / AAC | 44.1kHz | Streaming, not loaded to memory |
| Ambient loops | OGG Vorbis | 44.1kHz | Streaming |
| SFX (short, <1s) | WAV / PCM | 22.05-44.1kHz | Loaded to memory, needs instant playback |
| SFX (long, >1s) | OGG Vorbis | 44.1kHz | Compressed, streamed or pooled |
| UI sounds | WAV / PCM | 22.05kHz | Tiny files, instant playback |
| Voice / dialogue | OGG Vorbis / AAC | 44.1kHz mono | Mono unless spatial |

## Audio — Loudness Guidelines

| Use Case | Target LUFS | Headroom |
|----------|------------|----------|
| Music | -16 to -14 LUFS | -1dB peak |
| SFX | -12 to -10 LUFS | -1dB peak |
| UI sounds | -18 to -16 LUFS | -1dB peak |
| Voice | -16 to -14 LUFS | -1dB peak |

All audio assets should be normalized to their category target. Deviation >3 LUFS from category target = flag.
