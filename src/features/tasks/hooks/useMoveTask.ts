import { useMutation, useQueryClient } from "@tanstack/react-query";

import { moveTask } from "../api/tasks.api";

import type { Task } from "../types/task.types";

interface MoveTaskVariables {
  task: Task;
  sourceColumnId: string;
  targetColumnId: string;
  position: number;
}

interface MoveTaskContext {
  previousSourceTasks?: Task[];
  previousTargetTasks?: Task[];
  sourceKey: readonly unknown[];
  targetKey: readonly unknown[];
}

export function useMoveTask(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    /*
     * --------------------------------------------------
     * API REQUEST
     * --------------------------------------------------
     */
    mutationFn: ({ task, sourceColumnId, targetColumnId, position }: MoveTaskVariables) =>
      moveTask(organizationId, projectId, sourceColumnId, task.id, {
        targetColumnId,
        position,
      }),

    /*
     * --------------------------------------------------
     * OPTIMISTIC UPDATE
     * --------------------------------------------------
     *
     * Update the board immediately instead of waiting
     * for the backend response.
     */
    onMutate: async ({
      task,
      sourceColumnId,
      targetColumnId,
      position,
    }): Promise<MoveTaskContext> => {
      const sourceKey = ["board-tasks", organizationId, projectId, sourceColumnId];

      const targetKey = ["board-tasks", organizationId, projectId, targetColumnId];

      /*
       * Stop any currently running task queries.
       *
       * This prevents an old response from overwriting
       * our optimistic update.
       */
      await queryClient.cancelQueries({
        queryKey: ["board-tasks", organizationId, projectId],
      });

      /*
       * Save the current state so we can restore it
       * if the API request fails.
       */
      const previousSourceTasks = queryClient.getQueryData<Task[]>(sourceKey);

      const previousTargetTasks = queryClient.getQueryData<Task[]>(targetKey);

      /*
       * --------------------------------------------------
       * SAME COLUMN
       * --------------------------------------------------
       *
       * Example:
       *
       * Todo:
       *   A
       *   B
       *   C
       *
       * Move C -> top
       *
       * Result:
       *   C
       *   A
       *   B
       */
      if (sourceColumnId === targetColumnId) {
        if (!previousSourceTasks) {
          return {
            previousSourceTasks,
            previousTargetTasks,
            sourceKey,
            targetKey,
          };
        }

        const newTasks = [...previousSourceTasks];

        const currentIndex = newTasks.findIndex((currentTask) => currentTask.id === task.id);

        if (currentIndex === -1) {
          return {
            previousSourceTasks,
            previousTargetTasks,
            sourceKey,
            targetKey,
          };
        }

        /*
         * Remove the task from its current position.
         */
        const [movedTask] = newTasks.splice(currentIndex, 1);

        /*
         * Insert it into the requested position.
         */
        newTasks.splice(position, 0, {
          ...movedTask,
          columnId: targetColumnId,
          position,
        });

        /*
         * Recalculate positions for every task.
         */
        const updatedTasks = newTasks.map((currentTask, index) => ({
          ...currentTask,
          position: index,
        }));

        /*
         * IMPORTANT:
         *
         * sourceKey and targetKey are the same key here.
         *
         * Therefore we only update it once.
         */
        queryClient.setQueryData<Task[]>(sourceKey, updatedTasks);

        return {
          previousSourceTasks,
          previousTargetTasks,
          sourceKey,
          targetKey,
        };
      }

      /*
       * --------------------------------------------------
       * DIFFERENT COLUMN
       * --------------------------------------------------
       *
       * Example:
       *
       * Todo:
       *   A
       *   B
       *
       * In Progress:
       *   C
       *   D
       *
       * Move A -> In Progress
       *
       * Result:
       *
       * Todo:
       *   B
       *
       * In Progress:
       *   C
       *   A
       *   D
       */
      if (!previousSourceTasks || !previousTargetTasks) {
        return {
          previousSourceTasks,
          previousTargetTasks,
          sourceKey,
          targetKey,
        };
      }

      /*
       * Remove the task from the source column.
       */
      const newSourceTasks = previousSourceTasks.filter(
        (currentTask) => currentTask.id !== task.id,
      );

      /*
       * Remove the task from the target column too.
       *
       * This protects against accidental duplicate rendering
       * if the cache already contains the task.
       */
      const newTargetTasks = previousTargetTasks.filter(
        (currentTask) => currentTask.id !== task.id,
      );

      /*
       * Create the optimistic version of the task.
       */
      const movedTask: Task = {
        ...task,
        columnId: targetColumnId,
        position,
      };

      /*
       * Insert the task into the requested position.
       */
      newTargetTasks.splice(position, 0, movedTask);

      /*
       * Recalculate positions in both columns.
       */
      const updatedSourceTasks = newSourceTasks.map((currentTask, index) => ({
        ...currentTask,
        position: index,
      }));

      const updatedTargetTasks = newTargetTasks.map((currentTask, index) => ({
        ...currentTask,
        position: index,
      }));

      /*
       * Update both columns immediately.
       */
      queryClient.setQueryData<Task[]>(sourceKey, updatedSourceTasks);

      queryClient.setQueryData<Task[]>(targetKey, updatedTargetTasks);

      return {
        previousSourceTasks,
        previousTargetTasks,
        sourceKey,
        targetKey,
      };
    },

    /*
     * --------------------------------------------------
     * ROLLBACK
     * --------------------------------------------------
     *
     * If the backend rejects the move, restore the
     * previous frontend state.
     */
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(context.sourceKey, context.previousSourceTasks);

      /*
       * Don't restore the target twice when both keys
       * point to the same column.
       */
      if (context.sourceKey !== context.targetKey) {
        queryClient.setQueryData(context.targetKey, context.previousTargetTasks);
      }
    },

    /*
     * --------------------------------------------------
     * RE-SYNC WITH BACKEND
     * --------------------------------------------------
     *
     * Even though the UI moves immediately, we still
     * invalidate the affected columns after the request.
     *
     * This guarantees that the frontend eventually
     * matches the backend.
     */
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board-tasks", organizationId, projectId, variables.sourceColumnId],
      });

      /*
       * If the task moved between columns, refresh the
       * destination column as well.
       */
      if (variables.sourceColumnId !== variables.targetColumnId) {
        queryClient.invalidateQueries({
          queryKey: ["board-tasks", organizationId, projectId, variables.targetColumnId],
        });
      }
    },
  });
}
