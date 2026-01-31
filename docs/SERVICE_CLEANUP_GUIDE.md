# 🧹 Service Files Cleanup Guide

## Files to Keep (Active Services)

These files are actively used and should **NOT** be deleted:

### Core Services
- ✅ `services/dataSource.service.ts` - Main unified data source
- ✅ `services/api.client.ts` - Axios HTTP client with JWT
- ✅ `services/mock.service.ts` - Mock data for testing

### API Service Modules
- ✅ `services/api/auth.api.ts` - Authentication endpoints
- ✅ `services/api/subscriptions.api.ts` - Subscription endpoints
- ✅ `services/api/goals.api.ts` - Goals endpoints
- ✅ `services/api/messages.api.ts` - Messages endpoints
- ✅ `services/api/scopes.api.ts` - Scopes endpoints
- ✅ `services/api/packages.api.ts` - Packages endpoints
- ✅ `services/api/dashboard.api.ts` - Dashboard endpoints
- ✅ `services/api/index.ts` - Central API exports

### Mock Data Files (Supporting)
- ✅ `services/goals.mock.ts` - Mock goals data (used by mock.service.ts)
- ✅ `services/message.mock.ts` - Mock messages data (used by mock.service.ts)
- ✅ `services/profile.mock.ts` - Mock profile data (legacy, can keep for reference)

---

## Files to Delete (Obsolete Services)

These files have been replaced by the new unified system and can be safely deleted:

### ⚠️ Old API Services (Replaced)

```bash
# Delete these files:
rm services/api.ts                    # Replaced by api/* modules
rm services/data.service.ts           # Replaced by dataSource.service.ts
rm services/data-source.service.ts    # Replaced by dataSource.service.ts
rm services/auth.service.ts           # Replaced by dataSource + api/auth.api.ts
rm services/signsa.service.ts         # Replaced by api/* modules
```

### Why Each File is Obsolete

#### `services/api.ts`
- **Old Purpose**: Generic API wrapper for JSONPlaceholder
- **Why Obsolete**: We now have specific API modules in `services/api/*`
- **Replacement**: `services/api/auth.api.ts`, `services/api/goals.api.ts`, etc.

#### `services/data.service.ts`
- **Old Purpose**: Unified data service with API switching
- **Why Obsolete**: Replaced by better implementation
- **Replacement**: `services/dataSource.service.ts`
- **Improvements**: Better error handling, cleaner interface, consistent return types

#### `services/data-source.service.ts`
- **Old Purpose**: Original data source switcher
- **Why Obsolete**: Replaced by improved version
- **Replacement**: `services/dataSource.service.ts` (new implementation)
- **Improvements**: Simpler API, better TypeScript support, integrated with apiClient

#### `services/auth.service.ts`
- **Old Purpose**: Authentication with token management
- **Why Obsolete**: Functionality split into better modules
- **Replacement**:
  - Token management: `services/api.client.ts`
  - Auth endpoints: `services/api/auth.api.ts`
  - Unified access: `services/dataSource.service.ts`
- **Improvements**: Separation of concerns, automatic token refresh

#### `services/signsa.service.ts`
- **Old Purpose**: Sign SA API wrapper
- **Why Obsolete**: Replaced by modular API services
- **Replacement**: Individual API modules in `services/api/*`
- **Improvements**: Better organization, easier to maintain, type-safe

---

## Migration Verification

### Before Deleting, Verify No References

Run these commands to check if any code still references the old files:

```bash
# Check for imports of old services
grep -r "from '@/services/api'" --include="*.ts" --include="*.tsx" .
grep -r "from '@/services/data.service'" --include="*.ts" --include="*.tsx" .
grep -r "from '@/services/data-source.service'" --include="*.ts" --include="*.tsx" .
grep -r "from '@/services/auth.service'" --include="*.ts" --include="*.tsx" .
grep -r "from '@/services/signsa.service'" --include="*.ts" --include="*.tsx" .
```

### Expected Results

✅ **All imports should now use**:
- `from '@/services/dataSource.service'`
- `from '@/services/api'` (for direct API access)
- `from '@/services/mock.service'` (for tests)

❌ **No imports should reference**:
- `services/api.ts`
- `services/data.service.ts`
- `services/data-source.service.ts`
- `services/auth.service.ts`
- `services/signsa.service.ts`

---

## Cleanup Commands

### Option 1: Delete Immediately (PowerShell)

```powershell
# Navigate to project root
cd c:\WORK\sign_app

# Delete obsolete services
Remove-Item services/api.ts
Remove-Item services/data.service.ts
Remove-Item services/data-source.service.ts
Remove-Item services/auth.service.ts
Remove-Item services/signsa.service.ts

# Verify deletion
Get-ChildItem services/*.ts
```

### Option 2: Rename for Backup (PowerShell)

```powershell
# Rename with .old extension for safety
Rename-Item services/api.ts -NewName api.ts.old
Rename-Item services/data.service.ts -NewName data.service.ts.old
Rename-Item services/data-source.service.ts -NewName data-source.service.ts.old
Rename-Item services/auth.service.ts -NewName auth.service.ts.old
Rename-Item services/signsa.service.ts -NewName signsa.service.ts.old
```

### Option 3: Move to Archive Folder

```powershell
# Create archive folder
New-Item -ItemType Directory -Path services/archive -Force

# Move old files
Move-Item services/api.ts services/archive/
Move-Item services/data.service.ts services/archive/
Move-Item services/data-source.service.ts services/archive/
Move-Item services/auth.service.ts services/archive/
Move-Item services/signsa.service.ts services/archive/
```

---

## Testing After Cleanup

After deleting the old files, run these tests to ensure everything works:

### 1. TypeScript Compilation
```bash
npx tsc --noEmit
```
**Expected**: No errors

### 2. Start Development Server
```bash
npx expo start --clear
```
**Expected**: App starts without import errors

### 3. Test Core Features
- ✅ Login with demo credentials
- ✅ View dashboard
- ✅ View goals
- ✅ View messages
- ✅ Logout

### 4. Check Bundle Size (Optional)
```bash
npx expo export:web
```
**Expected**: Slightly smaller bundle without unused code

---

## Rollback Plan (If Needed)

If something breaks after cleanup:

### Option 1: Restore from Archive
```powershell
Move-Item services/archive/* services/
```

### Option 2: Restore from Git
```bash
git checkout HEAD -- services/api.ts
git checkout HEAD -- services/data.service.ts
git checkout HEAD -- services/data-source.service.ts
git checkout HEAD -- services/auth.service.ts
git checkout HEAD -- services/signsa.service.ts
```

### Option 3: Restore from Backup
```powershell
Rename-Item services/api.ts.old -NewName api.ts
Rename-Item services/data.service.ts.old -NewName data.service.ts
# ... etc
```

---

## Final Directory Structure

After cleanup, your `services/` folder should look like:

```
services/
├── api/                          # ✅ Active API modules
│   ├── auth.api.ts              # Authentication endpoints
│   ├── dashboard.api.ts         # Dashboard endpoints
│   ├── goals.api.ts             # Goals endpoints
│   ├── messages.api.ts          # Messages endpoints
│   ├── packages.api.ts          # Packages endpoints
│   ├── scopes.api.ts            # Scopes endpoints
│   ├── subscriptions.api.ts     # Subscriptions endpoints
│   └── index.ts                 # Central exports
├── api.client.ts                # ✅ Axios client with JWT
├── dataSource.service.ts        # ✅ Main unified data source
├── mock.service.ts              # ✅ Mock data service
├── goals.mock.ts                # ✅ Mock goals data
├── message.mock.ts              # ✅ Mock messages data
└── profile.mock.ts              # ✅ Mock profile data (legacy)
```

**Total Active Files**: 14
**Obsolete Files Removed**: 5

---

## Benefits of Cleanup

1. **Smaller Bundle Size**: Remove unused code
2. **Clearer Architecture**: Easier to understand
3. **Faster Development**: Less confusion about which service to use
4. **Better Maintenance**: Only one way to do things
5. **Reduced Complexity**: Fewer files to manage

---

## Recommendation

**Wait 1-2 weeks** before deleting the old files. This allows time to:
- Verify the new system works perfectly
- Test all features thoroughly
- Identify any edge cases
- Build confidence in the new architecture

After that, use **Option 3 (Move to Archive)** for safekeeping, then delete the archive folder after another month if everything is stable.

---

## Questions?

If you're unsure about deleting any file:

1. **Check imports**: Use grep/search to find all references
2. **Test without it**: Rename with `.old` and test the app
3. **Backup first**: Always have a git commit or backup
4. **Keep if doubtful**: Better safe than sorry

The current system works with all files present, so cleanup is optional and can be done gradually. 🎯
