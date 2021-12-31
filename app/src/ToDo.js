import Item from "./Item";

function ToDo(props) {
    return (
        <div class="todo">
            {
                props.todoList.map((d, i) => (
                    <Item
                        key={i}
                        value={d}
                        complete={props.complete}
                        remove={props.remove}
                    />
                ))
            }
        </div>
    );
}

export default ToDo;