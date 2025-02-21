import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  //useEffect,
} from 'react';

import TaskService from '../services/task.service';
import { ApiResponse, AsyncError } from '../types';
import { Task } from '../types/task';

import useAsync from './async.hook';

// Define the TaskContextType interface
type TaskContextType = {
  addTask: (title: string, description: string) => Promise<Task>;
  addTaskError: AsyncError;
  deleteTask: (taskId: string) => Promise<void>;
  deleteTaskError: AsyncError;
  getTasks: () => Promise<Task[]>;
  getTasksError: AsyncError;
  isAddTaskLoading: boolean;
  isDeleteTaskLoading: boolean;
  isGetTasksLoading: boolean;
  isUpdateTaskLoading: boolean;
  setTasksList: React.Dispatch<React.SetStateAction<Task[]>>;
  task: Task;
  tasks: Task[];
  tasksList: Task[];
  updateTask: (taskId: string, taskData: Partial<Task>) => Promise<Task>;
  updateTaskError: AsyncError;
  updatedTask: Task;
};

const TaskContext = createContext<TaskContextType | null>(null);

const taskService = new TaskService();

export const useTaskContext = (): TaskContextType => useContext(TaskContext)!;

const addTaskFn = async (
  title: string,
  description: string,
): Promise<ApiResponse<Task>> => taskService.addTask(title, description);

const updateTaskFn = async (
  taskId: string,
  taskData: Task,
): Promise<ApiResponse<Task>> => taskService.updateTask(taskId, taskData);

const deleteTaskFn = async (taskId: string): Promise<ApiResponse<void>> =>
  taskService.deleteTask(taskId);

export const TaskProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [tasksList, setTasksList] = useState<Task[]>([]);

  const getTasksFn = async (): Promise<ApiResponse<Task[]>> => {
    const response = await taskService.getTasks();
    setTasksList(response.data);
    return response;
  };

  const {
    asyncCallback: getTasks,
    error: getTasksError,
    isLoading: isGetTasksLoading,
    result: tasks,
  } = useAsync(getTasksFn);

  const {
    asyncCallback: addTask,
    error: addTaskError,
    isLoading: isAddTaskLoading,
    result: task,
  } = useAsync(addTaskFn);

  const {
    asyncCallback: updateTask,
    error: updateTaskError,
    isLoading: isUpdateTaskLoading,
    result: updatedTask,
  } = useAsync(updateTaskFn);

  const {
    asyncCallback: deleteTask,
    error: deleteTaskError,
    isLoading: isDeleteTaskLoading,
  } = useAsync(deleteTaskFn);

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasksList((prevTasks) => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        addTask,
        addTaskError,
        deleteTask: handleDeleteTask,
        deleteTaskError,
        getTasks,
        getTasksError,
        isAddTaskLoading,
        isDeleteTaskLoading,
        isGetTasksLoading,
        isUpdateTaskLoading,
        setTasksList,
        task,
        tasks,
        tasksList,
        updateTask,
        updateTaskError,
        updatedTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
