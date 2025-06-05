import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  taskName: z.string().min(2, {
    message: 'Task name must be at least 2 characters.',
  }),
  description: z
    .string()
    .min(2, {
      message: 'Task description must be at least 2 characters.',
    })
    .optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    invalid_type_error: 'Priority must be low, medium, or high.',
    required_error: 'Priority is required.',
  }),
  dueDate: z.date({
    invalid_type_error: 'Due date must be a date.',
    required_error: 'Due date is required.',
  }),
  projectId: z.string({
    invalid_type_error: 'Project ID must be a string.',
    required_error: 'Project ID is required.',
  }),
  labelId: z.string({
    invalid_type_error: 'Label ID must be a string.',
    required_error: 'Label ID is required.',
  }),
});

export function AddTaskForm({
  setShowAddTask,
}: {
  setShowAddTask: (show: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: '',
      description: '',
      priority: 'low',
      dueDate: new Date(),
      projectId: '',
      labelId: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <Card className="flex gap-2 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <FormField
            control={form.control}
            name="taskName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Write a task name"
                    className="!text-lg !border-none !bg-card focus-visible:ring-0 focus-visible:border-none"
                    {...field}
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    placeholder="What is this task about?"
                    className="border-none !text-base !bg-card focus-visible:ring-0 focus-visible:border-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 mt-4 p-2">
            <Button variant={'outline'} onClick={() => setShowAddTask(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
