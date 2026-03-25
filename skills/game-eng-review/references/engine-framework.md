# Engine & Framework Reference

## Engine Selection Decision Matrix

| Factor | Unity | Godot | Unreal Engine | Custom Engine |
|--------|-------|-------|---------------|---------------|
| **Team Size Sweet Spot** | 1-50 | 1-10 | 10-200+ | 5-20 (experienced) |
| **2D Support** | Strong (Tilemap, SpriteRenderer, 2D physics) | Excellent (native 2D pipeline, not retrofitted) | Weak (Paper2D deprecated in spirit) | Depends on implementation |
| **3D Support** | Good (URP/HDRP, adequate for most) | Improving (Vulkan renderer, but behind) | Excellent (Nanite, Lumen, best-in-class) | Depends on implementation |
| **Mobile** | Proven (majority of mobile games) | Usable (export quality improving) | Possible but heavy (runtime size, thermal) | Lightweight if built for it |
| **Console** | Supported (Switch, PS, Xbox) | PS/Xbox in progress, Switch partial | Full support (native console tooling) | Requires per-platform SDK licensing |
| **Web/WebGL** | Supported (large build sizes) | Supported (smaller builds) | Not supported | Possible if designed for it |
| **Learning Curve** | Medium (C#, large API surface) | Low (GDScript intuitive, small API) | High (C++, Blueprint, massive framework) | N/A (you build the curve) |
| **License Cost** | Free under $200K/yr revenue, then 2.5% | Free (MIT, forever) | Free under $1M revenue, then 5% | Free (but you pay in dev time) |
| **Asset Ecosystem** | Large (Asset Store, mature) | Growing (Asset Library, smaller) | Large (Marketplace, high-quality) | None (build everything) |
| **CI/CD** | Moderate (Unity Build Server licensing) | Good (command-line export, no extra license) | Complex (large builds, UGS or custom) | Full control |

### When to Choose Each

- **Unity:** Mobile-first games, 2D or mid-fidelity 3D, team has C# experience, need broad platform reach.
- **Godot:** Small team, 2D games, prototyping, open-source requirement, budget-conscious, web export important.
- **Unreal:** High-fidelity 3D, team has C++ experience or dedicated Blueprint designers, console AAA, need Nanite/Lumen/MetaHuman.
- **Custom engine:** Team has prior engine experience AND the game has a specific technical need no existing engine serves (e.g., voxel engine, custom physics, extreme performance requirement). Red flag if chosen for "control" without a specific technical justification.

## Engine-Specific Architectural Patterns

### Unity

| Pattern | When to Use | When to Avoid |
|---------|------------|---------------|
| **MonoBehaviour (classic)** | Small projects, prototypes, <50 active GameObjects | Performance-critical systems with 1000+ entities |
| **ECS (DOTS/Entities)** | Mass entity simulation (bullets, particles, crowds) | Simple games where MonoBehaviour is sufficient; API still evolving |
| **ScriptableObjects for Data** | Game config, item databases, ability definitions, shared state | Runtime-generated data that changes per-play |
| **Addressables** | DLC, asset streaming, reducing build size, platform-specific assets | Small projects where Resources folder is sufficient |
| **IL2CPP** | Release builds (required for iOS, recommended everywhere) | Development iteration (use Mono for fast compile) |
| **Assembly Definitions** | Projects with >20 scripts (controls recompilation scope) | Tiny projects where compile time is already instant |

**Unity gotchas:**
- GC allocations in Update/FixedUpdate cause frame hitches. Profile with Deep Profile; cache GetComponent results.
- Coroutines allocate on start. For frequent short timers, use a timer manager or UniTask.
- String operations (concatenation, ToString) allocate. Use StringBuilder or interpolated strings with caution in hot paths.
- DOTS/Entities API changes between versions. Pin your Entities package version; do not auto-update.

### Godot

| Pattern | When to Use | When to Avoid |
|---------|------------|---------------|
| **Node tree composition** | Standard game objects (player, enemies, UI) | Flat data processing (use arrays/dictionaries) |
| **Signals** | Loose coupling between nodes (UI updates, events) | High-frequency per-frame communication (direct call faster) |
| **Direct method calls** | Performance-critical per-frame logic | Cross-system communication (creates tight coupling) |
| **GDScript** | Gameplay logic, prototyping, most game code | CPU-intensive algorithms (pathfinding, procedural gen) |
| **C# (.NET)** | CPU-heavy systems, team knows C#, sharing code with server | Simple projects where GDScript is sufficient |
| **GDExtension (C/C++)** | Maximum performance for specific bottleneck systems | General game logic (overkill, slow iteration) |
| **Autoloads (singletons)** | Global managers (audio, save system, scene transitions) | More than 5-7 autoloads (becomes implicit dependency web) |

**Godot gotchas:**
- GDScript is ~10-100x slower than C++ for computation. Profile before rewriting in C# — the bottleneck may be elsewhere.
- Node tree depth affects performance. Deep trees with many children slow down scene tree operations. Flatten where possible.
- Exported properties reset when script changes in certain cases. Use resource files for important data.
- 3D renderer is less mature than Unity/Unreal. Test on target hardware early, especially for mobile 3D.

### Unreal Engine

| Pattern | When to Use | When to Avoid |
|---------|------------|---------------|
| **Blueprint** | Rapid prototyping, designer-tunable logic, UI, simple gameplay | Performance-critical loops, complex algorithms |
| **C++** | Core systems, performance-critical code, engine-level features | Simple one-off logic that designers need to tweak |
| **Blueprint/C++ boundary** | C++ base class + Blueprint-exposed functions + Blueprint subclass | Putting ALL logic in one layer |
| **GameplayAbilitySystem (GAS)** | RPGs, action games with many abilities, buff/debuff systems | Simple games with <5 player actions |
| **Data Assets / Data Tables** | Item databases, enemy stats, level configs, localization | Runtime-generated data |
| **Subsystems** | Game-wide services (inventory, quest, matchmaking) | Per-actor logic (use components) |
| **Gameplay Tags** | Categorizing abilities, states, items without hard enums | Simple bool flags where an enum suffices |

**Unreal gotchas:**
- Blueprint tick is ~10x slower than C++ tick. Move anything called per-frame to C++ or use timers.
- Binary asset format means merge conflicts on Blueprints/levels are unresolvable. Use strict asset locking workflow.
- Nanite/Lumen require modern GPUs (RTX 2060+ or equivalent). If targeting older hardware, plan fallback rendering.
- Build sizes start at 100-200MB minimum (engine runtime). Not suitable for small web or mobile games.
- Full C++ recompile can take 5-30 minutes. Use Live Coding and modular build targets to reduce iteration time.

## Engine-Agnostic Architecture Patterns

| Pattern | Description | Best For | Watch Out |
|---------|-------------|----------|-----------|
| **Component-Based** | Entities composed of reusable behavior components | Most games; flexible, composable | Deep component chains become hard to debug |
| **ECS (Entity Component System)** | Data-oriented: entities are IDs, components are data, systems process data | Mass simulation (1000+ entities), cache-friendly | Over-engineering for simple games; paradigm shift for OOP teams |
| **State Machines (FSM/HSM)** | Explicit states with defined transitions | AI behavior, game flow, animation | State explosion for complex behavior; consider behavior trees |
| **Event Bus / Message Bus** | Central dispatcher for decoupled communication | Cross-system events (UI updates, achievements, analytics) | Debugging invisible event chains; untyped events hide errors |
| **Service Locator** | Global registry of services, retrieved by interface | Dependency injection without framework; testable singletons | Hides dependencies; can become a god object if abused |
| **Object Pooling** | Pre-allocate and recycle frequently created/destroyed objects | Bullets, particles, enemies, any high-frequency spawn/despawn | Pool size tuning; stale state bugs from recycled objects |
| **Command Pattern** | Encapsulate actions as objects | Undo/redo, replay systems, input buffering, network commands | Overhead for simple one-shot actions |

## Build Pipeline Considerations

### CI/CD for Games

| Stage | What It Does | Tools / Approach |
|-------|-------------|-----------------|
| **Source Build** | Compile code, verify no errors | Engine CLI build (Unity: `-batchmode -buildTarget`, Godot: `--headless --export`, Unreal: BuildCookRun) |
| **Asset Bake** | Process art assets, compress textures, build atlases | Engine import pipeline; can take 10-60 minutes for large projects |
| **Automated Tests** | Run unit tests, integration tests, smoke tests | Engine test frameworks (Unity Test Runner, GUT for Godot, Automation for Unreal) |
| **Platform Builds** | Build per-platform binaries | Separate build agents per platform; console builds require devkit hardware |
| **Size Check** | Verify build size within store limits | Script that checks output size against budget; fail build if exceeded |
| **Distribution** | Push to testers, staging, or store | Steam Depot, TestFlight, Google Play internal testing, itch.io butler |

**Key rule:** If a build takes >30 minutes, the team will stop running it frequently. Optimize build pipeline early — it determines iteration speed for the entire project.

### Platform-Specific Build Notes

- **iOS:** Requires macOS build agent. Code signing and provisioning profiles expire and break CI silently. Automate renewal.
- **Android:** Multiple ABIs (arm64, x86_64). Test APK size against Play Store limits per ABI. AAB format recommended.
- **Console:** Devkit hardware required for builds. Cannot run in cloud CI without special (expensive) arrangements.
- **WebGL/Web:** Build size directly impacts load time. Every MB = ~1 second on average broadband. Tree-shake aggressively.
