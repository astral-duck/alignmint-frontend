import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Plus, Calendar, Repeat, Trash2 } from 'lucide-react';
import { useApp, entities } from '../contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';

export const TodoList: React.FC = () => {
  const { selectedEntity, todos, addTodo, toggleTodo, deleteTodo } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    entityId: selectedEntity,
    dueDate: '',
    isRecurring: false,
    recurringFrequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
  });

  // Filter todos based on selected entity
  const filteredTodos = todos.filter(todo => 
    selectedEntity === 'all' ? true : todo.entityId === selectedEntity
  );

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return;

    const todoData: any = {
      title: newTodo.title,
      description: newTodo.description,
      entityId: newTodo.entityId,
      completed: false,
      dueDate: newTodo.dueDate || undefined,
    };

    if (newTodo.isRecurring && newTodo.dueDate) {
      // Calculate next due date based on frequency
      const currentDate = new Date(newTodo.dueDate);
      let nextDueDate = new Date(currentDate);
      
      switch (newTodo.recurringFrequency) {
        case 'daily':
          nextDueDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          nextDueDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          nextDueDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'yearly':
          nextDueDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }

      todoData.recurring = {
        frequency: newTodo.recurringFrequency,
        nextDueDate: nextDueDate.toISOString().split('T')[0],
      };
    }

    addTodo(todoData);
    setNewTodo({
      title: '',
      description: '',
      entityId: selectedEntity,
      dueDate: '',
      isRecurring: false,
      recurringFrequency: 'monthly',
    });
    setDialogOpen(false);
  };

  const getEntityName = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    return entity?.name || 'All Nonprofits';
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const incompleteTodos = filteredTodos.filter(t => !t.completed);
  const completedTodos = filteredTodos.filter(t => t.completed);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle>Todo List</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage tasks and assignments for nonprofits
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="self-start sm:self-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add Todo</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Todo</DialogTitle>
                <DialogDescription>
                  Create a new task and assign it to a nonprofit
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                    placeholder="Enter todo title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                    placeholder="Enter todo description"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="entity">Assign to Nonprofit</Label>
                  <Select
                    value={newTodo.entityId}
                    onValueChange={(value) => setNewTodo({ ...newTodo, entityId: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {entities.map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>
                          {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTodo.dueDate}
                    onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="recurring">Recurring Task</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Automatically create new instance when completed
                    </p>
                  </div>
                  <Switch
                    id="recurring"
                    checked={newTodo.isRecurring}
                    onCheckedChange={(checked) => setNewTodo({ ...newTodo, isRecurring: checked })}
                  />
                </div>
                {newTodo.isRecurring && (
                  <div className="grid gap-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={newTodo.recurringFrequency}
                      onValueChange={(value) => setNewTodo({ ...newTodo, recurringFrequency: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTodo} disabled={!newTodo.title.trim()}>
                  Add Todo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Incomplete Todos */}
          {incompleteTodos.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Tasks ({incompleteTodos.length})
              </h3>
              {incompleteTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{todo.title}</p>
                        {todo.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {todo.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTodo(todo.id)}
                        className="h-8 w-8 shrink-0"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {getEntityName(todo.entityId)}
                      </Badge>
                      {todo.dueDate && (
                        <Badge
                          variant="outline"
                          className={`text-xs flex items-center gap-1 ${
                            isOverdue(todo.dueDate)
                              ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
                              : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                          }`}
                        >
                          <Calendar className="h-3 w-3" />
                          {todo.dueDate}
                          {isOverdue(todo.dueDate) && ' (Overdue)'}
                        </Badge>
                      )}
                      {todo.recurring && (
                        <Badge
                          variant="outline"
                          className="text-xs flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
                        >
                          <Repeat className="h-3 w-3" />
                          {todo.recurring.frequency}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed Todos */}
          {completedTodos.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Completed ({completedTodos.length})
              </h3>
              {completedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 opacity-60"
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-through">{todo.title}</p>
                        {todo.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-through">
                            {todo.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTodo(todo.id)}
                        className="h-8 w-8 shrink-0"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {getEntityName(todo.entityId)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredTodos.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No todos yet. Add one to get started!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
