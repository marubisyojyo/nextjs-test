# Fixes applied

- Tightened `tsconfig.json` so only the actual app source is type-checked.
- Excluded the accidental nested duplicate project under `context/` from the main build.
- Removed duplicate nested project files from `context/` and kept only `context/FavoritesContext.tsx`.
- Fixed `useParams` typing in `app/admin/products/edit/[id]/page.tsx`.
- Replaced `any` form event typing in the admin edit page with `FormEvent<HTMLFormElement>`.
- Simplified `FavoritesContext` type imports to avoid React namespace issues in strict TypeScript.
