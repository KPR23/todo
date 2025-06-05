import { Doc } from '../../../convex/_generated/dataModel';
import { AddTaskForm } from './add-task-form';
import TodoList from './todo-list';

export default function TodoPage({
  todos,
  completedTodos,
  incompletedTodos,
  showAddTask,
  setShowAddTask,
}: {
  todos: Doc<'todos'>[];
  completedTodos: Doc<'todos'>[];
  incompletedTodos: Doc<'todos'>[];
  showAddTask: boolean;
  setShowAddTask: (show: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl mt-4 mb-2 font-bold">All</h2>
      {showAddTask && <AddTaskForm setShowAddTask={setShowAddTask} />}
      <TodoList todos={todos} />
      {completedTodos.length > 0 && (
        <>
          <h2 className="text-2xl mt-4 mb-2 font-bold flex items-center gap-2">
            Completed
            <span className="text-lg text-muted-foreground">
              ({completedTodos.length})
            </span>
          </h2>
          <TodoList todos={completedTodos} />
        </>
      )}
      {incompletedTodos.length > 0 && (
        <>
          <h2 className="text-2xl mt-4 mb-2 font-bold">Incompleted</h2>
          <TodoList todos={incompletedTodos} />
        </>
      )}
    </div>
  );
}
