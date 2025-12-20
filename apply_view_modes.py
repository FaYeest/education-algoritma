#!/usr/bin/env python3
"""
Script to apply view mode changes to remaining algorithm visualizations.
Adds viewMode state and AllStepsList component integration.
"""

import re
import os

# Files that need changes (client-side algorithms)
FILES = {
    'BFS': 'src/components/Visualizations/BFS/BFSViz.jsx',
    'DFS': 'src/components/Visualizations/DFS/DFSViz.jsx',
    'MST': 'src/components/Visualizations/MST/MSTViz.jsx',
}

def add_import(content):
    """Add AllStepsList import if not present."""
    if 'AllStepsList' in content:
        return content
    
    # Find the last import before icons
    pattern = r"(import .* from ['\"]\.\./.*['\"])\n(import \{)"
    replacement = r"\1\nimport AllStepsList from '../../Common/AllStepsList'\n\2"
    
    return re.sub(pattern, replacement, content, count=1)

def add_states(content):
    """Add viewMode and animationCompleted states."""
    if 'viewMode' in content and 'animationCompleted' in content:
        return content
    
    # Find last useState before useEffect
    pattern = r"(\s+const \[[\w,\s]+\] = useState\([^\)]+\))\n\n(\s+useEffect)"
    
    new_states = r"\1\n  const [viewMode, setViewMode] = useState('step')\n  const [animationCompleted, setAnimationCompleted] = useState(false)\n\n\2"
    
    return re.sub(pattern, new_states, content, count=1)

def add_animation_completed_in_reset(content):
    """Add setAnimationCompleted(false) in handleReset."""
    if 'setAnimationCompleted(false)' in content:
        return content
    
    # Find handleReset function
    pattern = r"(const handleReset = \(\) => \{[\s\S]*?)(  \})"
    
    def replacer(match):
        func_body = match.group(1)
        closing = match.group(2)
        
        if 'setAnimationCompleted' not in func_body:
            # Add before closing brace
            return func_body + "    setAnimationCompleted(false)\n" + closing
        return match.group(0)
    
    return re.sub(pattern, replacer, content, count=1)

def add_animation_completed_in_effect(content):
    """Add setAnimationCompleted(true) when animation completes."""
    # Find useEffect with isPlaying logic
    pattern = r"(if \(step\.action === 'complete'[\s\S]*?setIsComplete\(true\))\n(\s+setIsPlaying\(false\))"
    replacement = r"\1\n\2\n          setAnimationCompleted(true)"
    
    content = re.sub(pattern, replacement, content)
    
    # Alternative pattern for simpler completion
    pattern2 = r"(setIsComplete\(true\))\n(\s+setIsPlaying\(false\))"
    replacement2 = r"\1\n\2\n        setAnimationCompleted(true)"
    
    return re.sub(pattern2, replacement2, content)

def add_view_mode_toggle_ui(content):
    """Add View Mode Toggle UI before main visualization."""
    if 'Mode Tampilan:' in content:
        return content
    
    # Find Speed Control section and add toggle before it
    pattern = r"(\s+{/\* Speed Control \*/})"
    
    toggle_ui = '''
      {/* View Mode Toggle */}
      <div className="card-brutal bg-white dark:bg-black p-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="font-black uppercase text-sm">Mode Tampilan:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('step')}
              className={`btn-brutal px-4 py-2 font-black uppercase text-sm ${
                viewMode === 'step'
                  ? 'bg-brutal-primary text-white'
                  : 'bg-white dark:bg-brutal-dark text-black dark:text-white'
              }`}
            >
              Step-by-Step
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn-brutal px-4 py-2 font-black uppercase text-sm ${
                viewMode === 'list'
                  ? 'bg-brutal-primary text-white'
                  : 'bg-white dark:bg-brutal-dark text-black dark:text-white'
              }`}
            >
              Lihat Semua Step
            </button>
          </div>
        </div>
      </div>

\1'''
    
    return re.sub(pattern, toggle_ui, content, count=1)

def add_all_steps_list(content, algo_name):
    """Add AllStepsList component at appropriate location."""
    if 'AllStepsList' in content and 'onGenerateSteps=' in content:
        return content
    
    # Determine the generate function name based on algorithm
    if 'BFS' in algo_name or 'DFS' in algo_name:
        gen_func = 'generateBFSSteps' if 'BFS' in algo_name else 'generateDFSSteps'
    elif 'MST' in algo_name:
        gen_func = 'generateMSTSteps'
    else:
        gen_func = 'generateSteps'
    
    # Find location to insert - before closing main content div
    # Look for pattern like: closing of current step display, then sidebar
    pattern = r"(          \}\)\}\n        </div>)\n\n(\s+{/\* Sidebar)"
    
    all_steps_component = f'''
        </div>

          {{/* All Steps List - Only shown in 'list' mode */}}
          {{viewMode === 'list' && (
            <div className="mt-4">
              <AllStepsList 
                steps={{steps}} 
                onGenerateSteps={{{gen_func}}}
                isLoading={{false}}
                animationCompleted={{animationCompleted}}
              />
            </div>
          )}}
        </div>

\2'''
    
    result = re.sub(pattern, all_steps_component, content, count=1)
    
    # If that pattern didn't work, try alternative
    if result == content:
        # Try simpler pattern before sidebar
        pattern2 = r"(        </div>)\n\n(\s+{/\* Sidebar)"
        result = re.sub(pattern2, all_steps_component, content, count=1)
    
    return result

def process_file(filepath, algo_name):
    """Process a single file to add view mode features."""
    print(f"\nProcessing {algo_name}...")
    
    if not os.path.exists(filepath):
        print(f"  ✗ File not found: {filepath}")
        return False
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Apply transformations
    content = add_import(content)
    content = add_states(content)
    content = add_animation_completed_in_reset(content)
    content = add_animation_completed_in_effect(content)
    content = add_view_mode_toggle_ui(content)
    content = add_all_steps_list(content, algo_name)
    
    if content == original_content:
        print(f"  ⚠ No changes made (might already be updated)")
        return False
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✓ Updated successfully")
    return True

def main():
    """Main function to process all files."""
    print("=" * 60)
    print("Applying View Mode Features to Algorithms")
    print("=" * 60)
    
    updated = 0
    skipped = 0
    
    for algo_name, filepath in FILES.items():
        # Skip BFS as we already manually started it
        if algo_name == 'BFS':
            print(f"\n{algo_name}: Skipping (manually updated)")
            skipped += 1
            continue
            
        if process_file(filepath, algo_name):
            updated += 1
        else:
            skipped += 1
    
    print("\n" + "=" * 60)
    print(f"Summary: {updated} updated, {skipped} skipped")
    print("=" * 60)
    print("\nNote: Manual review recommended for:")
    print("  - BFS (partially done)")
    print("  - DFS, MST (check function names)")
    print("\nRun 'npm run build' to verify syntax.")

if __name__ == '__main__':
    main()
