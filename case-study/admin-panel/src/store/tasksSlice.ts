import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../types';
import api from '../api';
import { AxiosError } from 'axios';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/tasks');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const approveTask = createAsyncThunk(
  'tasks/approveTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/approve`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to approve task');
    }
  }
);

export const rejectTask = createAsyncThunk(
  'tasks/rejectTask',
  async ({ taskId, reason }: { taskId: string; reason: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/reject`, { rejectionReason: reason });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to reject task');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Approve task
    builder.addCase(approveTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(approveTask.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    });
    builder.addCase(approveTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Reject task
    builder.addCase(rejectTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(rejectTask.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    });
    builder.addCase(rejectTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const { setTasks, addTask, updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;
