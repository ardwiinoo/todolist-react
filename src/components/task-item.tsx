import { MdCheckBox, MdCheckBoxOutlineBlank, MdDelete } from 'react-icons/md'
import { BaseText } from './base-text'
import { TaskInterface } from '../interface'
import { useStore } from '../stores'
import { useState, useRef, useEffect } from 'react'

interface Props {
    task: TaskInterface
}

const DISAPPEAR_CLASS = 'scake-75 -mb-[calc(48px+12px)] opacity-0 z-0'
const DISAPPEAR_DELAY = 120

export const TaskItem = (props: Props) => {
    const store = useStore()

    const [isDone, setIsDone] = useState(props.task.isDone)
    const [isDisappear, setIsDisappear] = useState(true)

    const taskRef = useRef<HTMLDivElement>(null)
    const labelRef = useRef<HTMLDivElement>(null)

    const toggleDone = () => {
        const transitionCallback = () => {

            setTimeout(() => {
                disappear(() => {
                    store.task.toggle(props.task.id)
                })
            }, DISAPPEAR_DELAY)

            labelRef.current?.addEventListener(
                'transitionend',
                transitionCallback,
                false
            )
        }

        labelRef.current?.addEventListener(
            'transitionend',
            transitionCallback,
            false
        )

        setIsDone(!isDone)
    }

    const disappear = (callback: Function) => {
        const transitionCallback = () => {
            callback()

            taskRef.current?.addEventListener(
                'transitionend',
                transitionCallback,
                false
            )
        }

        taskRef.current?.addEventListener(
            'transitionend',
            transitionCallback,
            false
        )

        setIsDisappear(true)
    }

    useEffect(() => {
        setTimeout(() => {
            setIsDisappear(false)
        })
    }, [DISAPPEAR_DELAY])

    return (
        <div 
            ref={taskRef}
            className={`
            relative
            ease-in-out
            duration-300    
            ${isDisappear ? DISAPPEAR_CLASS : 'z-10'}
        `}>
            <div className="
                flex
                items-center
                px-3
                h-[48px]
                dark:bg-component-dark
                bg-component
                gap-3
                shadow-lg
                my-[12px]
                rounded-lg
            ">
                <button onClick={() => toggleDone()}>
                    {!isDone ? (
                        <BaseText>
                            <MdCheckBoxOutlineBlank></MdCheckBoxOutlineBlank>
                        </BaseText>
                    ) : (
                        <MdCheckBox className='text-primary'></MdCheckBox>
                    )}
                </button>
                
                <div 
                    className='flex-1 truncate cursor-pointer' 
                    onClick={() => store.task.edit(props.task)}
                >    
                    <BaseText 
                        innerref={labelRef}
                        className={`
                            px-3
                            truncate
                            inline
                            relative
                            after:content-[' ']
                            after:absolute
                            after:left-0
                            after:h-[2px]
                            after:top-[calc(50%-2px)]
                            after:ease-in-out
                            after:duration-300
                            after:transition-width
                            ${isDone ? 'after:w-full' : 'after:w-0'}  
                            after:bg-primary
                        `}>
                            {props.task.title}
                        </BaseText>
                </div>
                
                <button className='text-danger' onClick={() => disappear(() => store.task.delete(props.task.id))}>
                    <MdDelete></MdDelete>
                </button>
            </div>
        </div>
    )
}