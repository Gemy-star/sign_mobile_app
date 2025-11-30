# Redux API Integration Guide

## Overview
Redux now manages all API data fetching and caching. This provides:
- Centralized API state management
- Automatic loading and error states
- Data caching and revalidation
- Optimistic updates
- Easy testing and debugging

---

## Available Redux Slices

### 1. Messages Slice (`messagesSlice`)

**State:**
```typescript
{
  messages: Message[],
  dailyMessage: DailyMessage | null,
  totalCount: number,
  currentPage: number,
  filters: MessageFilters,
  isLoading: boolean,
  error: string | null
}
```

**Actions:**
```typescript
// Async actions (API calls)
fetchMessages({ pagination?, filters? })
fetchDailyMessage()
createMessage(messageData)
rateMessage({ messageId, rating })

// Sync actions
setFilters(filters)
setCurrentPage(page)
clearError()
clearMessages()
```

**Usage Example:**
```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMessages, fetchDailyMessage } from '@/store/slices/messagesSlice';

function MessagesScreen() {
  const dispatch = useAppDispatch();
  const { messages, isLoading, error } = useAppSelector((state) => state.messages);

  useEffect(() => {
    // Fetch messages on mount
    dispatch(fetchMessages({ pagination: { page: 1, page_size: 20 } }));
  }, []);

  const handleLoadMore = () => {
    dispatch(fetchMessages({
      pagination: { page: currentPage + 1, page_size: 20 }
    }));
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => <MessageCard message={item} />}
      onEndReached={handleLoadMore}
    />
  );
}
```

---

### 2. Goals Slice (`goalsSlice`)

**State:**
```typescript
{
  goals: Goal[],
  totalCount: number,
  currentPage: number,
  filters: GoalFilters,
  isLoading: boolean,
  error: string | null
}
```

**Actions:**
```typescript
// Async actions (API calls)
fetchGoals({ pagination?, filters? })
createGoal(goalData)
updateGoalProgress({ goalId, progress })
completeGoal(goalId)
deleteGoal(goalId)

// Sync actions
setFilters(filters)
setCurrentPage(page)
clearError()
clearGoals()
```

**Usage Example:**
```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGoals, updateGoalProgress } from '@/store/slices/goalsSlice';

function GoalsScreen() {
  const dispatch = useAppDispatch();
  const { goals, isLoading, filters } = useAppSelector((state) => state.goals);

  useEffect(() => {
    dispatch(fetchGoals({
      filters: { is_completed: false } // Only active goals
    }));
  }, []);

  const handleUpdateProgress = (goalId: string, progress: number) => {
    dispatch(updateGoalProgress({ goalId, progress }));
  };

  const filterActive = () => {
    dispatch(setFilters({ is_completed: false }));
    dispatch(fetchGoals({ filters: { is_completed: false } }));
  };

  return (
    <View>
      <FilterButtons onFilterChange={filterActive} />
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onUpdateProgress={handleUpdateProgress}
        />
      ))}
    </View>
  );
}
```

---

### 3. Dashboard Slice (`dashboardSlice`)

**State:**
```typescript
{
  stats: DashboardStats | null,
  isLoading: boolean,
  error: string | null,
  lastFetched: number | null
}
```

**Actions:**
```typescript
// Async actions (API calls)
fetchDashboardStats()

// Sync actions
clearError()
clearDashboard()
```

**Usage Example:**
```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDashboardStats } from '@/store/slices/dashboardSlice';

function HomeScreen() {
  const dispatch = useAppDispatch();
  const { stats, isLoading, lastFetched } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    // Fetch if no data or data is stale (older than 5 minutes)
    const shouldFetch = !lastFetched || Date.now() - lastFetched > 5 * 60 * 1000;
    if (shouldFetch) {
      dispatch(fetchDashboardStats());
    }
  }, []);

  const handleRefresh = () => {
    dispatch(fetchDashboardStats());
  };

  return (
    <ScrollView refreshControl={
      <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
    }>
      {stats && (
        <>
          <StatCard title="Total Goals" value={stats.total_goals} />
          <StatCard title="Total Messages" value={stats.total_messages} />
          <StatCard title="Current Streak" value={stats.current_streak} />
        </>
      )}
    </ScrollView>
  );
}
```

---

### 4. Scopes Slice (`scopesSlice`)

**State:**
```typescript
{
  scopes: Scope[],
  categories: ScopeCategory[],
  selectedScopes: string[],
  isLoading: boolean,
  error: string | null
}
```

**Actions:**
```typescript
// Async actions (API calls)
fetchScopes()
fetchScopeCategories()
updateUserScopes(scopeIds)

// Sync actions
setSelectedScopes(scopeIds)
toggleScope(scopeId)
clearError()
```

**Usage Example:**
```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchScopes, toggleScope, updateUserScopes } from '@/store/slices/scopesSlice';

function ScopeSelectionScreen() {
  const dispatch = useAppDispatch();
  const { scopes, selectedScopes, isLoading } = useAppSelector((state) => state.scopes);

  useEffect(() => {
    dispatch(fetchScopes());
  }, []);

  const handleToggle = (scopeId: string) => {
    dispatch(toggleScope(scopeId));
  };

  const handleSave = () => {
    dispatch(updateUserScopes(selectedScopes));
  };

  return (
    <View>
      {scopes.map((scope) => (
        <Checkbox
          key={scope.id}
          label={scope.name}
          checked={selectedScopes.includes(scope.id)}
          onToggle={() => handleToggle(scope.id)}
        />
      ))}
      <Button onPress={handleSave} loading={isLoading}>
        Save Selection
      </Button>
    </View>
  );
}
```

---

## Best Practices

### 1. Data Fetching on Mount
```typescript
useEffect(() => {
  dispatch(fetchData());
}, []);
```

### 2. Conditional Fetching (Avoid Unnecessary API Calls)
```typescript
useEffect(() => {
  if (!data || isStale) {
    dispatch(fetchData());
  }
}, [data]);
```

### 3. Error Handling
```typescript
const { error } = useAppSelector((state) => state.messages);

if (error) {
  return <ErrorMessage message={error} onRetry={() => dispatch(fetchMessages())} />;
}
```

### 4. Optimistic Updates
```typescript
const handleRateMessage = (messageId: string, rating: number) => {
  // Optimistic update - UI updates immediately
  dispatch(rateMessage({ messageId, rating }));
  // Redux will handle success/failure automatically
};
```

### 5. Pagination
```typescript
const handleLoadMore = () => {
  if (!isLoading && currentPage * pageSize < totalCount) {
    dispatch(fetchMessages({
      pagination: { page: currentPage + 1, page_size: 20 }
    }));
  }
};
```

### 6. Pull to Refresh
```typescript
const handleRefresh = () => {
  dispatch(clearMessages()); // Clear old data
  dispatch(fetchMessages({ pagination: { page: 1, page_size: 20 } }));
};

<ScrollView refreshControl={
  <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
}>
```

---

## Common Patterns

### Pattern 1: List with Filters
```typescript
function MessagesScreen() {
  const dispatch = useAppDispatch();
  const { messages, filters, isLoading } = useAppSelector((state) => state.messages);

  const applyFilter = (newFilters: MessageFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchMessages({ filters: newFilters }));
  };

  return (
    <>
      <FilterBar onFilterChange={applyFilter} />
      <MessageList messages={messages} loading={isLoading} />
    </>
  );
}
```

### Pattern 2: Create with Optimistic Update
```typescript
const handleCreate = async (data: any) => {
  try {
    await dispatch(createGoal(data)).unwrap();
    // Success - data already in state
    showToast('Goal created successfully!');
  } catch (error) {
    // Error - show error message
    showToast('Failed to create goal');
  }
};
```

### Pattern 3: Edit with Rollback
```typescript
const handleUpdate = async (goalId: string, progress: number) => {
  const originalGoal = goals.find(g => g.id === goalId);

  try {
    await dispatch(updateGoalProgress({ goalId, progress })).unwrap();
  } catch (error) {
    // Rollback on error
    dispatch(updateGoalProgress({
      goalId,
      progress: originalGoal!.progress
    }));
    showToast('Update failed');
  }
};
```

### Pattern 4: Cached Data with Refresh
```typescript
useEffect(() => {
  const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
  const isStale = !lastFetched || Date.now() - lastFetched > CACHE_TIME;

  if (isStale) {
    dispatch(fetchDashboardStats());
  }
}, [lastFetched]);
```

---

## Integration with Existing Code

### Replace Mock Data
**Before:**
```typescript
import { MOCK_GOALS } from '@/services/goals.mock';

function GoalsScreen() {
  const [goals, setGoals] = useState(MOCK_GOALS);
  // ...
}
```

**After:**
```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGoals } from '@/store/slices/goalsSlice';

function GoalsScreen() {
  const dispatch = useAppDispatch();
  const { goals, isLoading } = useAppSelector((state) => state.goals);

  useEffect(() => {
    dispatch(fetchGoals());
  }, []);
  // ...
}
```

---

## Testing

### Testing Async Thunks
```typescript
import { fetchMessages } from '@/store/slices/messagesSlice';
import { store } from '@/store';

test('should fetch messages successfully', async () => {
  const result = await store.dispatch(fetchMessages({}));
  expect(result.type).toBe('messages/fetchMessages/fulfilled');
  expect(store.getState().messages.messages).toHaveLength(20);
});
```

### Testing Reducers
```typescript
import messagesReducer, { setFilters } from '@/store/slices/messagesSlice';

test('should set filters', () => {
  const initialState = { filters: {}, /* ... */ };
  const newState = messagesReducer(
    initialState,
    setFilters({ category: 'motivation' })
  );
  expect(newState.filters).toEqual({ category: 'motivation' });
});
```

---

## Debugging

### Redux DevTools
Enable Redux DevTools to inspect state and actions:
```typescript
// Already configured in store/index.ts
// Open Redux DevTools in browser/React Native Debugger
```

### Log Actions
```typescript
useEffect(() => {
  console.log('Current messages state:', messages);
  console.log('Loading:', isLoading);
  console.log('Error:', error);
}, [messages, isLoading, error]);
```

---

## Performance Tips

1. **Selective Subscriptions**: Only select data you need
```typescript
// ❌ Bad - re-renders on any messages state change
const messagesState = useAppSelector((state) => state.messages);

// ✅ Good - only re-renders when messages array changes
const messages = useAppSelector((state) => state.messages.messages);
```

2. **Memoized Selectors**: Use reselect for computed data
```typescript
import { createSelector } from '@reduxjs/toolkit';

const selectActiveGoals = createSelector(
  (state) => state.goals.goals,
  (goals) => goals.filter(g => !g.is_completed)
);
```

3. **Debounce API Calls**: Avoid excessive requests
```typescript
import { debounce } from 'lodash';

const debouncedFetch = debounce(() => {
  dispatch(fetchMessages({ filters: searchQuery }));
}, 500);
```

---

**Last Updated:** November 30, 2025
**Version:** 1.0
**Status:** ✅ Production Ready
