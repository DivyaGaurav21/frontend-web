"use client";
import React from 'react';
import TaskForm from './TaskForm';
import TaskItem from './TastItem';
import { useTaskStore } from '../store/task-store';

const page = () => {
    const tasks = useTaskStore((state) => state.tasks);
    return (
        <div className='p-10 m-auto max-w-6xl'>
            <TaskForm />
            <div className='flex flex-col gap-4 mt-8'>
                {
                    tasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                    ))
                }
            </div>
        </div>
    )
}

export default page