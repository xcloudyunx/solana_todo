function Item(props) {
    return (
        <div>
            <input type="checkbox" onChange={props.complete} />
            <label>{props.value}</label>
            <input type="radio" onChange={props.remove} />
        </div>
    );
}

export default Item;