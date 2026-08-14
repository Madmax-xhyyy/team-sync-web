import { useMutation, useQueryClient } from "@tanstack/react-query";

import { moveTask } from "../api/tasks.api";
import type { Task } from "../types/task.types";

interface MoveTaskVariables {
  taskId: string;
  columnId: string;
  targetColumnId: string;
  position: number;
}

type TasksByColumn = Record<string, Task[]>;

interface MoveTaskContext {
  previousData?: TasksByColumn;
}

export function useMoveTask(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  const boardTasksKey = ["board-tasks", organizationId, projectId];

  return useMutation<Task, Error, MoveTaskVariables, MoveTaskContext>({
    mutationFn: ({ taskId, columnId, targetColumnId, position }) =>
      moveTask(organizationId, projectId, columnId, taskId, {
        targetColumnId,
        position,
      }),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: boardTasksKey,
      });

      const previousData = queryClient.getQueryData<TasksByColumn>(boardTasksKey);

      if (!previousData) {
        return {};
      }

      /*
       * IMPORTANT:
       *
       * Wait until dnd-kit has finished its DOM cleanup.
       *
       * Updating the React Query cache immediately can cause React
       * to move/remove the same DOM node that dnd-kit is currently
       * manipulating.
       */
      requestAnimationFrame(() => {
        queryClient.setQueryData<TasksByColumn>(boardTasksKey, (currentData) => {
          if (!currentData) {
            return currentData;
          }

          const sourceTasks = [...(currentData[variables.columnId] ?? [])];

          const sourceIndex = sourceTasks.findIndex((task) => task.id === variables.taskId);

          if (sourceIndex === -1) {
            return currentData;
          }

          const [movedTask] = sourceTasks.splice(sourceIndex, 1);

          if (!movedTask) {
            return currentData;
          }

          const targetTasks =
            variables.columnId === variables.targetColumnId
              ? sourceTasks
              : [...(currentData[variables.targetColumnId] ?? [])];

          /*
           * Clamp the position so we never insert outside
           * the valid array range.
           */
          const position = Math.max(0, Math.min(variables.position, targetTasks.length));

          targetTasks.splice(position, 0, {
            ...movedTask,
            columnId: variables.targetColumnId,
          });

          const normalize = (tasks: Task[]): Task[] =>
            tasks.map((task, index) => ({
              ...task,
              position: index,
            }));

          return {
            ...currentData,

            [variables.columnId]: normalize(sourceTasks),

            [variables.targetColumnId]: normalize(targetTasks),
          };
        });
      });

      return {
        previousData,
      };
    },

    onError: (_error, _variables, context) => {
      if (!context?.previousData) {
        return;
      }

      /*
       * Also wait one frame before restoring the previous DOM state.
       */
      requestAnimationFrame(() => {
        queryClient.setQueryData(boardTasksKey, context.previousData);
      });
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: boardTasksKey,
      });
    },
  });
}
