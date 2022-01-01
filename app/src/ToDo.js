import Item from "./Item";

function ToDo(props) {
    return (
        <div id="todo" className="list">
            <h3>Todo</h3>
            {
                props.todoList.map((d, i) => (
                    <Item
                        key={i}
                        value={d}
                        complete={() => props.complete(i)}
                        remove={() => props.remove(i)}
                        completed={false}
                    />
                ))
            }
        </div>
    );
}

export default ToDo;