# Performance Budgets by Platform

Canonical platform-level performance budgets for game architecture review.
Other skills (e.g., `/asset-review`) should reference this file for platform constraints rather than maintaining separate copies.

## Frame Budget by Platform

| Platform | Target FPS | Frame Budget | Notes |
|----------|-----------|-------------|-------|
| PC (high-end) | 60-144 | 6.9-16.67ms | Variable refresh (G-Sync/FreeSync) provides headroom |
| PC (min spec) | 30-60 | 16.67-33.33ms | Define min spec explicitly — "most PCs" is not a spec |
| PS5 / Xbox Series X | 60 (or 30 quality) | 16.67ms (or 33.33ms) | Players expect 60fps mode; 30fps needs visual justification |
| PS4 / Xbox One | 30 | 33.33ms | Still a large installed base; do not ignore |
| Nintendo Switch (docked) | 30 | 33.33ms | GPU is mobile-class; plan accordingly |
| Nintendo Switch (handheld) | 30 | 33.33ms | Thermal throttle reduces GPU by ~20% vs docked |
| Mobile (high-end) | 60 | 16.67ms | Sustained performance is 60-70% of peak due to thermal throttling |
| Mobile (mid-range) | 30 | 33.33ms | Thermal throttle after 3-5 minutes of sustained load |
| Mobile (low-end) | 30 | 33.33ms | 2GB RAM ceiling, single-core bottleneck common |
| WebGL | 30-60 | Variable | JS overhead adds +3-5ms per frame; no threading |

### Frame Budget Allocation (Typical)

| System | % of Frame | 60fps (16.67ms) | 30fps (33.33ms) |
|--------|-----------|-----------------|-----------------|
| Rendering | 35-45% | 5.8-7.5ms | 11.7-15.0ms |
| Game Logic | 20-25% | 3.3-4.2ms | 6.7-8.3ms |
| Physics | 12-18% | 2.0-3.0ms | 4.0-6.0ms |
| Audio | 5-10% | 0.8-1.7ms | 1.7-3.3ms |
| UI | 5-10% | 0.8-1.7ms | 1.7-3.3ms |
| Headroom (spike buffer) | 5-10% | 0.8-1.7ms | 1.7-3.3ms |

**Key rule:** If subsystem budgets do not sum to less than the frame budget, the architecture is over-committed. Always check the sum.

## Draw Call Budgets

Draw calls are the primary rendering bottleneck on mobile and a significant factor on all platforms.

| Platform | Draw Call Budget | With Instancing | Notes |
|----------|-----------------|-----------------|-------|
| Mobile (low-end) | 50-100 | 100-200 | GPU driver overhead dominates |
| Mobile (mid-range) | 100-300 | 300-600 | Vulkan/Metal reduce driver overhead |
| Mobile (high-end) | 300-500 | 500-1000 | Still far below desktop |
| Nintendo Switch | 300-800 | 800-1500 | Depends on docked vs handheld |
| PC (mid-range) | 2000-3000 | 5000-10000 | DirectX 12/Vulkan reduce overhead |
| PC (high-end) | 3000-5000 | 10000+ | Rarely the bottleneck on modern GPUs |
| PS5 / Xbox Series X | 3000-5000 | 8000+ | Custom GPU command buffers |
| PS4 / Xbox One | 1000-2000 | 3000-5000 | Previous-gen hardware limits |
| WebGL | 100-500 | 500-1000 | Browser overhead; WebGPU improves this |

### Batching Strategies

- **Static batching:** Pre-combine meshes that share material and never move. Best for environment geometry.
- **Dynamic batching:** Runtime combine small meshes (<300 vertices per mesh). Free but limited to simple geometry.
- **GPU instancing:** Same mesh drawn many times with different transforms. Best for repeated objects (trees, bullets, crowds).
- **SRP batching (Unity) / Automatic instancing (Unreal):** Engine-level batching. Requires compatible shaders.
- **Indirect rendering:** GPU-driven rendering pipeline. Complex to implement, massive draw call reduction for large scenes.

**When to use which:** Static for environments, instancing for repeated objects, indirect for 1000+ unique objects. If the architecture doc mentions none of these for a game with complex scenes, flag as concern.

## Memory Budgets by Platform

| Platform | Total RAM | OS/System Overhead | Available for Game | Texture Budget (40-60%) |
|----------|----------|-------------------|-------------------|------------------------|
| Mobile (low-end, 2GB) | 2 GB | ~800 MB | ~1.0-1.2 GB | 400-700 MB |
| Mobile (mid-range, 4GB) | 4 GB | ~1.2 GB | ~2.5-2.8 GB | 1.0-1.7 GB |
| Mobile (high-end, 6-8GB) | 6-8 GB | ~1.5 GB | ~4.0-6.0 GB | 1.6-3.6 GB |
| Nintendo Switch | 4 GB | ~1 GB | ~3.0 GB | 1.2-1.8 GB |
| PS4 / Xbox One | 8 GB (unified) | ~3 GB | ~5.0 GB | 2.0-3.0 GB |
| PS5 / Xbox Series X | 16 GB (unified) | ~4 GB | ~12.0 GB | 4.8-7.2 GB |
| PC (min spec, 8GB) | 8 GB | ~3 GB | ~4.5-5.0 GB | 1.8-3.0 GB |
| PC (recommended, 16GB) | 16 GB | ~4 GB | ~11.0-12.0 GB | 4.4-7.2 GB |
| WebGL | ~1-2 GB (browser tab limit) | ~500 MB | ~500 MB-1.5 GB | 200-900 MB |

### Memory Allocation Guidelines

| Category | % of Game Budget | Notes |
|----------|-----------------|-------|
| Textures | 40-60% | Largest single consumer; compress aggressively on mobile |
| Meshes / Geometry | 10-20% | LOD reduces this significantly for 3D games |
| Audio | 5-15% | Compressed streaming for music; uncompressed for SFX latency |
| Runtime Objects / Heap | 10-20% | GC-heavy languages (C#, JS) need allocation strategy for hot paths |
| Shaders / Materials | 3-8% | Shader variants can explode memory; audit variant count |
| UI / Fonts / Atlases | 2-5% | Font atlases with CJK support can be surprisingly large |
| System / Engine Overhead | 5-10% | Includes engine runtime, physics broadphase, navigation mesh |

**Critical check:** Sum all subsystem budgets. If total exceeds "Available for Game" for the target platform's minimum spec, the architecture is over-committed. This is the "multiplication" Claude tends to skip.

## Texture Size Standards

These are maximum texture dimensions per asset type. Actual texture memory depends on format and compression.

| Asset Type | Mobile | PC / Console | Notes |
|-----------|--------|-------------|-------|
| Character (hero/player) | 512-1024 | 2048-4096 | Main character often gets the largest budget |
| Character (NPC / enemy) | 256-512 | 1024-2048 | Scale with screen importance |
| Environment (tileset/terrain) | 256-512 | 512-2048 | Tiling textures can be smaller |
| Props / Small objects | 128-256 | 256-1024 | Often atlas-packed |
| UI elements | 128-256 | 256-512 | Vector UI avoids this entirely |
| Skybox / Panorama | 1024 | 2048-4096 | Single large texture, loaded once |
| Effects / Particles | 64-128 | 128-512 | Small and numerous; atlas-pack |
| Lightmaps (per chunk) | 256-512 | 512-2048 | Can dominate memory if unbounded |

### Compression Formats

| Platform | Recommended Format | Ratio vs Uncompressed | Notes |
|----------|-------------------|----------------------|-------|
| iOS | ASTC (4x4 to 8x8) | 4:1 to 16:1 | Quality vs size trade-off via block size |
| Android | ASTC or ETC2 | 4:1 to 16:1 | ETC2 for broad compat; ASTC for quality |
| PC (DirectX) | BC7 (quality) / BC1 (size) | 4:1 to 8:1 | BC7 for color, BC5 for normals |
| Console | BC7 / platform-native | 4:1 to 8:1 | Similar to PC |
| WebGL | Basis Universal / KTX2 | 6:1 to 16:1 | Transcodes to platform-native at load |

## Build Size Limits by Store

| Store / Platform | Hard Limit | Practical Limit | Notes |
|-----------------|-----------|----------------|-------|
| iOS App Store | 4 GB | 200 MB (OTA) | >200 MB requires WiFi download; impacts conversion |
| Google Play Store | 150 MB base APK | 150 MB base | Play Asset Delivery for additional content (up to 2 GB) |
| Nintendo eShop | 32 GB | Varies by cartridge size | MicroSD consideration; digital-only games should target <8 GB |
| PlayStation Store | 50 GB (disc) | No hard digital limit | Larger games need mandatory install management |
| Xbox Store | 50 GB (disc) | No hard digital limit | Smart Delivery can reduce per-platform size |
| Steam | No hard limit | <20 GB recommended | >20 GB reduces install conversion; >100 GB is a support burden |
| itch.io | 1 GB default | Can request increase | Web builds should target <50 MB |
| WebGL (browser) | No store limit | <50 MB ideal | >100 MB causes high abandonment; >200 MB is unusable on mobile browsers |

### Size Budget Allocation (Typical)

| Content Type | % of Build | Notes |
|-------------|-----------|-------|
| Textures (compressed) | 30-50% | Usually the largest contributor |
| Audio (compressed) | 15-30% | Music and voice acting dominate |
| Meshes / Geometry | 5-15% | Small for 2D games |
| Code / Scripts | 2-10% | Larger for scripted engines (Unity IL2CPP, Godot) |
| Video / Cutscenes | 0-30% | Can dominate if present; consider streaming |
| Shaders (compiled) | 1-5% | Variant explosion can inflate this |
| Level Data / Configs | 2-8% | Includes scene files, prefabs, configs |
| Engine Runtime | 5-15% | Overhead varies dramatically by engine |
