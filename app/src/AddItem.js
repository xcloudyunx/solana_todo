function AddItem(props) {
    return (
        <form onSubmit={props.add}>
            <input
                placeholder="Add new task"
                onChange={e => props.setInput(e.target.value)}
                value={props.input}
            />
            <input type="submit" value="Add task" />
        </form>
    )
}

export default AddItem;