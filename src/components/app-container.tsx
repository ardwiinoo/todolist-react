import { observer } from 'mobx-react';
import { ThemeToggle } from './theme-toggle';
import Logo from '../logo.svg'
import { BaseText } from './base-text';
import { useStore } from '../stores';
import { useEffect } from 'react'
import { TaskList } from './task-list';
import { TaskInput } from './task-input';

export const AppContainer = observer(() => {
    const store = useStore()

    useEffect(() => {
        document.body.setAttribute('data-mode', store.theme.themeMode)
    }, [store.theme.themeMode])

    return (
        <div className='max-w-screen-md mx-auto p-3'>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <img src={Logo} alt='logo'></img>
                    <div className="text-xl text-primary">
                        <a href='https://github.com/ardwiinoo' target='blank'>TodoList </a>
                    </div>
                </div>
                <ThemeToggle></ThemeToggle>
            </div>
            <TaskInput></TaskInput>
            <TaskList></TaskList>
        </div>
    )
})