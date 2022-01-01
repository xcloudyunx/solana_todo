function AddItem(props) {
    return (
        <form
            onSubmit={props.add}
            className="addItem"
        >
            <input
                placeholder="Add new task"
                onChange={e => props.setInput(e.target.value)}
                value={props.input}
                className="taskInput"
            />
            <input type="submit" value="Add task" />
        </form>
    )
}

export default AddItem;