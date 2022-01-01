function Item(props) {
    return (
        <div className="item">
            <input
                type="checkbox"
                onChange={props.completed ? null : props.complete}
                className="complete"
                checked={props.completed}
                disabled={props.completed}
            />
            <label
                className="label"
            >
                {props.value}
            </label>
            <input
                type="button"
                onClick={props.completed ? null : props.remove}
                className="remove"
                style={{visibility: props.completed ? "hidden" : "visible"}}
            />
        </div>
    );
}

export default Item;