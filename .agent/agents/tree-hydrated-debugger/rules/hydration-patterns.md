
# Hydration Prevention Rules

- Never use Date() in render
- Never use Math.random() in render
- Avoid window/document in server components
- Always wrap client-only logic in useEffect
- Use dynamic() with ssr:false for charts/editors/maps
- Stable IDs only (useId or server-provided)
- Supabase client must be client-only
