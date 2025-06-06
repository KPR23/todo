import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Card, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
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
  setShowAddTask: Dispatch<SetStateAction<boolean>>;
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col ml-2"
        >
          <FormField
            control={form.control}
            name="taskName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Write a task name"
                    className="!text-lg !p-0 !border-none !bg-card focus-visible:ring-0 focus-visible:border-none"
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
                    placeholder="What is this task about? (optional)"
                    className="resize-none !p-0 border-none !text-base !bg-card focus-visible:ring-0 focus-visible:border-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <FontAwesomeIcon
                          icon={faCalendarDays}
                          className="ml-auto h-4 w-4 opacity-50"
                        />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <CardFooter className="items-center justify-end mt-4 gap-2">
            <Button variant={'outline'} onClick={() => setShowAddTask(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
