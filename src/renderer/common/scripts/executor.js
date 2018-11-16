class Executor {
  constructor () {
    this.tasks = []
  }
  addTask (task) {
    this.tasks.push(task)
  }
  execute () {
    if (this.tasks.length === 0) {
      return
    }
    this.tasks.forEach((task, index) => {
      task.setNext(this.tasks[index + 1])
    })
    this.tasks[0].run()
  }
}
export default Executor
