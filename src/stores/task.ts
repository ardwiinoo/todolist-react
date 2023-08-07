import { action, computed, makeAutoObservable, observable } from "mobx";
import { TaskInterface } from "../interface";

const STORAGE_KEY = '@tasks'

export class Task {
    constructor() {
        makeAutoObservable(this)
        this.fetch()
    }

    protected fetch() {
        this._tasks = JSON.parse(localStorage[STORAGE_KEY])
    }

    protected sync() {
        localStorage[STORAGE_KEY] = JSON.stringify(this._tasks)
    }

    @observable
    protected _tasks: TaskInterface[] = []

    @observable
    protected _tasksEdit?: TaskInterface

    @computed
    get taskEdit() {
        return this._tasksEdit
    }

    @action
    edit(task: TaskInterface) {
        this._tasksEdit = task
    }

    @computed
    get tasks() {
        return this._tasks.filter((task) => !task.isDone)
            .sort((a, b) => b.updateAt - a.updateAt)
    }

    @computed
    get completedTasks() {
        return this._tasks.filter((task) => task.isDone)
            .sort((a, b) => b.updateAt - a.updateAt)
    }

    protected generateId(): number {
        let rand = Math.random()

        while(this._tasks.find(task => task.id === rand)) {
            rand = Math.random()
        }

        return rand
    }

    protected find(id: TaskInterface['id'], callback: (task: TaskInterface, index: number) => void) {
        const index = this._tasks.findIndex((task) => task.id === id)

        if(index != -1) {
            callback(this._tasks[index], index)
        }
    }

    @action
    add(title: string) {
        this._tasks.push({
                id: this.generateId(),
                title: title,
                isDone: false,
                updateAt: new Date().getTime()
            }
        )

        this.sync()
    }

    @action
    update(id: TaskInterface['id'], title: string) {
        this.find(id, (task, i) => {
            this._tasks[i] = {
                ...task,
                title
            }

            this._tasksEdit = undefined
            this.sync()
        })
    }

    @action
    delete(id: TaskInterface['id']) {
        this.find(id, (task, i) => {
            this._tasks.splice(i, 1)
            this.sync()
        })
    }

    @action
    toggle(id: TaskInterface['id']) {
        this.find(id, (task, i) => {
            this._tasks[i] = {
                ...task,
                isDone: !task.isDone,
                // update when task complete
                updateAt: !task.isDone ? new Date().getTime() : task.updateAt
            }

            this.sync()
        })
    }
}